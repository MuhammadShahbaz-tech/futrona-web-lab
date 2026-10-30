
import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const PORT = 4000;
const CLIENT_URL = "http://localhost:5173";

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

app.get("/", (_req, res) => {
  res.json({
    status: "online",
    message: "FUTRONA Real-Time Server is running.",
  });
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.emit("realtime:status", {
    message: "Connected to FUTRONA Real-Time Server",
    timestamp: new Date().toISOString(),
  });

  socket.on("realtime:event", (data) => {
    const event = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      message:
        typeof data?.message === "string"
          ? data.message.slice(0, 200)
          : "New real-time event",
      timestamp: new Date().toISOString(),
      source: socket.id,
    };

    // Send the event to all connected clients.
    io.emit("realtime:event", event);

    console.log("Real-time event:", event.message);
  });

  //WebRTC signaling

  socket.on("webrtc:join", async(roomValue) => {
    const room = 
      typeof roomValue === "string"
        ? roomValue.trim().slice(0, 50)
        : "";

        if(!room) {
          socket.emit("webrtc:error", {
            message: "Please enter a valid room name.",
          });
          return
        }

        if (socket.data.webrtcRoom) {
          socket.emit("webrtc:error", {
            message: "Leave your current WebRTC room before joining another."
          });
          return;
        }

        const roomName = `wertc:${room}`;
        const existingPeers = [
          ...(io.sockets.adapter.room.get(roomName) || []),
        ];

        if(existingPeers.length >= 2) {
          socket.emit("wertc:error", {
            message: "This room is full. Only two peers are supported.",
          });
          return;
        }

        await socket.join(roomName);
        socket.data.webrtcRoom = roomName;

        socket.emit("webrtc:joined", {
          room,
          peerId:existingPeers[0] || null,
          initiator: existingPeers.length === 0,
        });

        if (existingPeers.length === 1) {
          io.to(existingPeers[0].emit("webrtc:peer-joined"), {
            peerId: socket.id,
          });
        }

        console.log(`WebRTC peer ${socket.id} joined room ${room}`);
  })

  //WebRTC Relay offer

  const relayWebRTCSignal = (eventName) => {
    socket.on(eventName, (data) => {
      const target = data?.target;
      const room = socket.data.webrtcRoom;

      if(
        !room ||
        typeof target !== "String" || 
        !io.sockets.sockets.get(target) ||
        !io.sockets.adapter.rooms.get(room)?.has(target)
      ) {
        return
      }
      io.to(target).emit(eventName, {
        ...data,
        sender:socket.id,
      });
    });
  };

  relayWebRTCSignal("webrtc:offer");
  relayWebRTCSignal("webrtc:answer");
  relayWebRTCSignal("webrtc:ice-candidate");

  socket.on("webrtc:leave", () => {
    const room = socket.data.webrtcRoom;

    if(!room) return;

    socket.leave(room);
    delete socket.data.webrtcRoom;

    socket.to(room).emit("webrtc:peer-left", {
      peerId: socket.id,
    });

    console.log(`WebRTC peer ${socket.id} left room: ${room}`);
  });

  socket.on("disconneting", () => {
    const room = socket.data.webrtcRoom
    if(room) {
      socket.to(room).emit("webrtc:peer-left", {
        peerId: socket.id,
      });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id} (${reason})`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`FUTRONA Real-Time Server: http://localhost:${PORT}`);
});
