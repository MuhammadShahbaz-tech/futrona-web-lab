
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import "./Experiments.css";
import { events } from "@react-three/fiber";
import { add, div } from "three/src/nodes/math/OperatorNode.js";

const SERVER_URL = "http://localhost:4000";
const RTC_CONFIGURATION = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const Experiments = () => {
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const socketRef = useRef(null);
    const peerRef = useRef(null);
    const channelRef = useRef(null);
    const targetPeerRef = useRef(null);
    const pendingCandidatesRef = useRef([]);
    const initiatorRef = useRef(false);
    const mountedRef = useRef(false);

    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);

    const [room, setRoom] = useState("futrona-lab");
    const [roomStatus, setRoomStatus] = useState("disconnected");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const closePeer = useCallback(() => {
        channelRef.current?.close();
        channelRef.current = null;

        peerRef.current?.close();
        peerRef.current = null;

        targetPeerRef.current = null;
        pendingCandidatesRef.current = [];
    }, []);

    const addMessage = useCallback((text, sender) => {
        setMessage((previous) => [
            ...previous,
            {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                text,
                sender,
                time: new Date().toLocaleTimeString(),
            },
        ].slice(-100))
    }, []);

    const createPeer = useCallback((socket, peerId) => {
        closePeer();

        targetPeerRef.current = peerId;

        const peer = new RTCPeerConnection(RTC_CONFIGURATION);
        peerRef.current = peer;

        peer.onicecandidate = (event) => {
            if (event.candidate && socektRef.current && targetPeerRef.current) {
                socket.emit("webrtc:ice-candidate", {
                    target: targetPeerRef.current,
                    candidate: event.candidate,
                });
            }
        };

        peer.connectionstatechange = () => {
            if (peerRef.current !== peer) return;

            const state = peer.connectionState;

            if (state === "connected") {
                setRoomStatus("connected");
            } else if (state === "failed") {
                setRoomStatus("failed");
                addMessage("Peer connection failed. Try reconnecting.", "system");
            } else if (state === "disconnected") {
                setRoomStatus("connecting");
            }
        };

        peer.ondatachannel = (event) => {
            const channel = event.channel;
            channelRef.current = channel;

            channel.onopen = () => {
                setRoomStatus("connected");
                addMessage("Peer-to-peer data channel is ready.", "system");
            };

            channel.onclose = () => {
                if (channelRef.current = channel) {
                    setRoomStatus("connecting");
                }
            };

            channel.onmessage = (MessageEvent) => {
                addMessage(MessageEvent.data, "peer");
            };
        };

        return peer;
    }, [addMessage, closePeer]);

    const flushPendingCandidates = useCallback(async (peer) => {
        const candidates = pendingCandidatesRef.current.splice();

        for (const candidate of candidates) {
            try {
                await peer.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.log("Could not add queqed ICE Candidate:", err);
            }
        }
    }, []);

    const leaveRoom = useCallback(() => {
        socketRef.current?.emit("webrtc:leave");
        socketRef.current?.diconnect();
        socketRef.current = null;

        closePeer();

        setRoomStatus("disconnected");
        setError("");
    }, [closePeer]);


    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;

            socketRef.current?.emit("webrtc:leave");
            socketRef.current?.disconnect();
            socketRef.current = null;

            closePeer();
            streamRef.current?.getTracks().forEach((track) => track.stop());
        };
    }, [closePeer]);

    const joinRoom = () => {
        const cleanRoom = room.trim();

        if (!cleanRoom) {
            setError("Enter a room name first.");
            return;
        }

        if (socketRef.current) return;

        setError("");
        setMessage([]);
        setRoomStatus("connecting");

        const socket = io(SERVER_URL);
        socketRef.current = socket;

        socket.on("connect", () => {
            socket.emit("webrtc:join", cleanRoom);
        });

        socket.on("connect_error", () => {
            setError("Could not connect to the signaling server. Check start that port 4000 is running.");
            setRoomStatus("disconnected");
        });

        socket.on("webrtc:error", (data) => {
            setError(data?.message || "Could not join the room");
            setRoomStatus("disconnected");
            socket.disconnect();

            if (socketRef.current === socket) {
                socket.current = null;
            }
        });

        socket.on("webrtc.joined", ({ peerId, initiator }) => {
            initiatorRef.current = initiator;
            addMessage(
                initiator
                    ? `Room "${cleanRoom}" created. Waiting for another peer.`
                    : `joined room "${cleanRoom}". conneting to peer...`,
                "system",
            );

            if (peerId) {
                const peer = createPeer(socket, peerId);

                if (initiator) {
                    const channel = peer.createDataChannel("futrona-messages");
                    channelRef.current = channel;

                    channel.onopen = () => {
                        setRoomStatus("connected");
                        addMessage("Peer-to-peer data channel is ready.", "system");
                    };

                    channel.onclose = () => {
                        if (channelRef.current === channel) {
                            setRoomStatus("connecting");
                        }
                    };

                    channel.onmessage = (event) => {
                        addMessage(event.data, "peer");
                    };

                    peer.createOffer()
                        .then((offer) => peer.setLocalDescription(offer))
                        .then(() => {
                            socket.emit("webrtc:offer", {
                                target: peerId,
                                description: peer.localDescription,
                            });
                        })
                        .catch((err) => {
                            setError(`Could not createoffer ${err.message}`);
                        });
                }
            }
        });

        socket.on("webrtc:peer-joined", ({ peerId }) => {
            if (peerRef.current) return;

            const peer = createPeer(socket, peerId);

            addMessage("Another peer joined. Preparing secure connection...", "system");
        });

        socket.on("webrtc:offer", async ({ sender, description }) => {
            try {
                let peer = peerRef.current;

                if (!peer || targetPeerRef.current !== sender) {
                    peer = createPeer(socket, sender);
                }

                await peer.setRemoteDescription(
                    new RTCSessionDescription(description),
                );

                await flushPendingCandidates(peer);

                const answer = await peer.createAnswer();
                await peer.setLocalDescription(answer);

                socket.emit("webrtc:answer", {
                    target: sender,
                    description: peer.localDescription,
                });
            } catch (err) {
                setError(`Could not answer connection: ${err.message}`);
            }
        });

        socket.on("webrtc:answer", async ({ sender, description }) => {
            try {
                const peer = peerRef.current;

                if (!peer || targetPeerRef.current !== sender) return;

                await peer.setRemoteDescription(
                    new RTCSessionDescription(description)
                );

                await flushPendingCandidates(peer);
            } catch (err) {
                setError("Could not complete connection: ${err.message");
            }
        });

        socket.on("webrtc:ice-candidate", async ({ sender, candidate }) => {
            const peer = peerRef.current;

            if (!peer || targetPeerRef.current !== sender || !peer.remoteDescription) {
                if (targetPeerRef.current === sender) {
                    pendingCandidatesRef.current.push(candidate);
                }
                return;
            }

            try {
                await peer.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.error("Could not add ICE candidate", err);
            }
        });

        socket.on("webrtc:peer-left", () => {
            closePeer();
            setRoomStatus("Waiting");
            message("The other peer left the room.", "system");
        });
    };

    const sendMessage = (event) => {
        event.preventDefault();

        const text = message.trim();
        const channel = channelRef.current;

        if (!text || !channel || channel.readyState !== "open") return;

        channel.send(text);
        addMessage(text, "you");
        setMessage("");
    };

    const startMedia = async () => {
        setError("");

        if (!navigator.mediaDevices?.getUserMedia) {
            setStatus("error");
            setError(
                "Camera access is unavailable. Use localhost or a secure HTTPS connection in a supported browser."
            );
            return;
        }

        setStatus("connecting");

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            setAudioEnabled(true);
            setVideoEnabled(true);
            setStatus("active");
        } catch (err) {
            setStatus("error");

            if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                setError("Camera or microphone permission was denied. Allow access in your browser and try again.");
            } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
                setError("No compatible camera or microphone was found on this device.");
            } else {
                setError(err.message || "Could not access your camera or microphone.");
            }
        }
    };

    const stopMedia = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setStatus("idle");
        setAudioEnabled(true);
        setVideoEnabled(true);
        setError("");
    };

    const toggleAudio = () => {
        const nextEnabled = !audioEnabled;
        streamRef.current?.getAudioTracks().forEach((track) => {
            track.enabled = nextEnabled;
        });
        setAudioEnabled(nextEnabled);
    };

    const toggleVideo = () => {
        const nextEnabled = !videoEnabled;
        streamRef.current?.getVideoTracks().forEach((track) => {
            track.enabled = nextEnabled;
        });
        setVideoEnabled(nextEnabled);
    };

    const connected = roomStatus === "connected";

    return (
        <section className="webrtc-experiments" id="webrtc-experiments">
            <div className="webrtc-experiments__top">
                <span>02 / Live Experiment</span>
                <span>Local Media Access</span>
            </div>

            <div className="webrtc-experiments__heading">
                <p className="webrtc-experiments__eyebrow">Your device. Your signal.</p>
                <h2>
                    Step into
                    <br />
                    <span>the connection.</span>
                </h2>
                <p>
                    Enable your camera and microphone to test local media capture
                    directly in your browser.
                </p>
            </div>

            <div className="webrtc-experiments__workspace">
                <div className="webrtc-experiments__video">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        aria-label="Your local camera preview"
                    />

                    {status !== "active" && (
                        <div className="webrtc-experiments__placeholder">
                            <span className="webrtc-experiments__placeholder-icon">◎</span>
                            <p>
                                {status === "connecting"
                                    ? "Requesting device access..."
                                    : "Your live preview will appear here"}
                            </p>
                        </div>
                    )}

                    <div className="webrtc-experiments__video-label">
                        <span className={status === "active" ? "is-active" : ""} />
                        {status === "active" ? "LOCAL STREAM ACTIVE" : "LOCAL STREAM STANDBY"}
                    </div>
                </div>

                <div className="webrtc-experiments__controls">
                    <div className="webrtc-experiments__control-status">
                        <span>DEVICE STATUS</span>
                        <strong>
                            {status === "active"
                                ? "Media connected"
                                : status === "connecting"
                                    ? "Requesting access"
                                    : status === "error"
                                        ? "Access unavailable"
                                        : "Waiting for permission"}
                        </strong>
                    </div>

                    <div className="webrtc-experiments__control-actions">
                        {status !== "active" ? (
                            <button
                                type="button"
                                onClick={startMedia}
                                disabled={status === "connecting"}
                            >
                                {status === "connecting" ? "Connecting..." : "Enable Camera & Mic"}
                                <span aria-hidden="true">↗</span>
                            </button>
                        ) : (
                            <>
                                <button type="button" onClick={toggleAudio}>
                                    {audioEnabled ? "Mute Microphone" : "Enable Microphone"}
                                </button>
                                <button type="button" onClick={toggleVideo}>
                                    {videoEnabled ? "Turn Camera Off" : "Turn Camera On"}
                                </button>
                                <button
                                    type="button"
                                    className="webrtc-experiments__stop"
                                    onClick={stopMedia}
                                >
                                    End Local Stream
                                </button>
                            </>
                        )}
                    </div>

                    {error && (
                        <p className="webrtc-experiments__error" role="alert">
                            {error}
                        </p>
                    )}

                    <p className="webrtc-experiments__note">
                        Camera and microphone access requires your permission.
                        Your preview stays local; this step does not send media to another peer.
                    </p>
                </div>
            </div>

            <div className="webrtc-experiments__chat">
                <div className="webrtc-experiments__chat-header">
                    <div>
                        <p className="webrtc-experiments__eyebrow">WebRTC / DataChannel</p>
                        <h3>Peer Connection</h3>
                    </div>

                    <span className={`webrtc-experiments__connection-state ${connected ? "is connected" : ""}`}>
                        {roomStatus.replace("-", " ").toUpperCase()}
                    </span>
                </div>

                <div className="webrtc-experiments__room-controls">
                    <label htmlFor="webrtc-room">ROOM NAME</label>
                    <input
                        id="webrtc-room"
                        value={room}
                        onChange={(event) => setRoom(event.target.value)}
                        maxLength={50}
                        disabled={Boolean(socketRef.current)}
                        placeholder="Enter the same room in both tabs"
                    />

                    {!socketRef.current ? (
                        <button type="button" onClick={joinRoom}>Join Room ↗</button>
                    ) : (
                        <button type="button" className="webrtc-experiments__stop" onClick={leaveRoom}>
                            Leave Room
                        </button>
                    )}
                </div>

                <div className="webrtc-experiments__messages" aria-live="polite">
                    {message.length === 0 ? (
                        <p className="webrtc-experiments__empty">
                            Join the same room in another tab to start the connection.
                        </p>
                    ): (
                        messages.map((item) => {
                            <div className={`webrtc-experiments__message is-${item.sender}`} key={item.id}>
                                <span>{item.sender === "you" ? "YOU" : item.sender === "peer" ? "PEER" : "SYSTEM"}</span>
                                <p>{item.text}</p>
                                <time>{item.time}</time>                                
                            </div>
                        })
                    )}
                </div>

                <form className="webrtc-experiments__message-form" onSubmit={sendMessage}>
                    <input 
                        value="message"
                        onChange={(event) => sendMessage(event.target.value)}
                        placeholder={connected ? "Write a message..." : "Connect to a peer first"}
                        aria-label="Message"
                        maxLength={2000}
                        disabled={!connected}
                    />
                    <button type="submit" disabled={!connected || !message.trim()}>
                        Send ↗
                    </button>
                </form>

                {error && <p className="webrtc-experiments__error" role="alert">{error}</p>}
            </div>
        </section>
    );
};

export default Experiments;
