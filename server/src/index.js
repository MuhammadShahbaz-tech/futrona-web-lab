
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

  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected: ${socket.id} (${reason})`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`FUTRONA Real-Time Server: http://localhost:${PORT}`);
});
