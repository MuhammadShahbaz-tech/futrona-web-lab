
import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./Experiments.css";
import { div } from "three/tsl";



const SERVER_URL = "http://localhost:4000";
const RTC_CONFIGURATION = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const CHUNK_SIZE = 16 * 1024;
const MAX_BUFFER_SIZE = 1024 * 1024;



const Experiments = () => {
    const videoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const fileInputRef = useRef(null);
    const fileTransferRef = useRef(null);
    const incomingFileRef = useRef(null);

    const streamRef = useRef(null);
    const remoteStreamRef = useRef(null);

    const socketRef = useRef(null);
    const peerRef = useRef(null);
    const channelRef = useRef(null);
    const targetPeerRef = useRef(null);
    const pendingCandidatesRef = useRef([]);
    const initiatorRef = useRef(false);
    const mountedRef = useRef(false);
    const makingOfferRef = useRef(false);
    const ignoreOfferRef = useRef(false);
    const settingRemoteAnswerPendingRef = useRef(false);

    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [remoteStream, setRemoteStream] = useState(null);

    const [room, setRoom] = useState("futrona-lab");
    const [roomStatus, setRoomStatus] = useState("disconnected");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileError, setFileError] = useState("");

    const [fileTransfer, setFileTransfer] = useState({
        status: "idle",
        progress: 0,
        transferred: 0,
        total: 0,
        fileName: "",
    });

    const [receivedFile, setReceivedFile] = useState(null);

    const closePeer = useCallback(() => {
        channelRef.current?.close();
        channelRef.current = null;

        peerRef.current?.close();
        peerRef.current = null;

        targetPeerRef.current = null;
        pendingCandidatesRef.current = [];

        makingOfferRef.current = false;
        ignoreOfferRef.current = false;
        settingRemoteAnswerPendingRef.current = false;
    }, []);

    const addMessage = useCallback((text, sender) => {
        setMessages((previous) => [
            ...previous,
            {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                text,
                sender,
                time: new Date().toLocaleTimeString(),
            },
        ].slice(-100));
    }, []);

    const handleIncomingFileData = useCallback((data) => {
        if (typeof data === "object" && data !== null && !(data instanceof ArrayBuffer)) {
            const { type, id } = data;

            if (data.__futronaFileTransfer !== true) return;

            if (type === "file-start") {
                if (
                    typeof id !== "string" ||
                    typeof data.name !== "string" ||
                    typeof data.size !== "number" ||
                    !Number.isSafeInteger(data.size) ||
                    data.size < 0 ||
                    data.size > MAX_FILE_SIZE ||
                    typeof data.mimeType !== "string"
                ) {
                    setFileError("Invalid or unsupported incoming file.");
                    return;
                }

                if (incomingFileRef.current) {
                    setFileError("Another file transfer is already in progress.");
                    return;
                }

                incomingFileRef.current = {
                    id,
                    name: data.name,
                    size: data.size,
                    mimeType: data.mimeType,
                    chunks: [],
                    received: 0,
                };

                setReceivedFile(null);
                setFileError("");

                setFileTransfer({
                    status: "receiving",
                    progress: 0,
                    transferred: 0,
                    total: data.size,
                    fileName: data.name,
                });

                addMessage(`Receiving file: ${data.name}`, "system");
                return;
            }

            if (type === "file-end") {
                const incoming = incomingFileRef.current;

                if (!incoming || incoming.id !== id) return;

                if (incoming.received !== incoming.size) {
                    incomingFileRef.current = null;
                    setFileTransfer((previous) => ({
                        ...previous,
                        status: "failed",
                    }));

                    setFileError(
                        "File transfer incomplete. Received file size does not match."
                    );
                    return;
                }

                const blob = new Blob(incoming.chunks, {
                    type: incoming.mimeType || "application/octet-stream",
                });

                setReceivedFile({
                    name: incoming.name,
                    size: incoming.size,
                    type: incoming.mimeType,
                    blob,
                });

                setFileTransfer({
                    status: "complete",
                    progress: 100,
                    transferred: incoming.size,
                    total: incoming.size,
                    fileName: incoming.name,
                });

                addMessage(`File received: ${incoming.name}`, "system");

                incomingFileRef.current = null;
                return;
            }

            if (type === "file-cancel") {
                const incoming = incomingFileRef.current;

                if (!incoming || incoming.id !== id) return;

                incomingFileRef.current = null;

                setFileTransfer({
                    status: "cancelled",
                    progress: 0,
                    transferred: 0,
                    total: 0,
                    fileName: "",
                });

                addMessage("Incoming file transfer was cancelled.", "system");
            }

            return;
        }

        //incoming binary chunk file

        if (!(data instanceof ArrayBuffer)) {
            console.warn("[WebRTC] Unsupported incoming data format.");
            return;
        }

        const incoming = incomingFileRef.current;

        if (!incoming) {
            console.warn("[WebRTC] Received a file chunk without file metadata.");
            return;
        }

        if (incoming.received + data.byteLength > incoming.size) {
            incomingFileRef.current = null;

            setFileTransfer((previous) => ({
                ...previous,
                status: "failed",
            }));

            setFileError("Incoming file exceeded its declared size.");
            return;
        }

        incoming.chunks.push(data);
        incoming.received += data.byteLength;

        const progress = incoming.size === 0
            ? 0
            : Math.round((incoming.received / incoming.size) * 100);

        setFileTransfer((previous) => ({
            ...previous,
            status: "receiving",
            transferred: incoming.received,
            progress,
        }));
    }, [addMessage]);

    const setupDataChannel = useCallback((channel) => {
        channelRef.current = channel;
        channel.binaryType = "arraybuffer";

        channel.onopen = () => {
            setRoomStatus("connected");
            addMessage("Peer-to-peer data channel is ready.", "system");
        };

        channel.onclose = () => {
            if (channelRef.current === channel) {
                channelRef.current = null;
                setRoomStatus("disconnected");
            }
        };

        channel.onerror = (event) => {
            if (channelRef.current !== channel) return;

            console.error("[WebRTC] Datachannel error:", event);
            setError("DataChannel encountered an error.");
        };

        channel.onmessage = (event) => {
            if (typeof event.data === "string") {
                let payload;

                try {
                    payload = JSON.parse(event.data);
                } catch {
                    addMessage(event.data, "peer");
                    return;
                }

                if (payload?.__futronaFileTransfer === true) {
                    handleIncomingFileData(payload);
                    return;
                }

                addMessage(event.data, "peer");
                return;
            }

            handleIncomingFileData(event.data);
        };
    }, [addMessage, handleIncomingFileData]);

    const createPeer = useCallback((socket, peerId) => {
        closePeer();

        targetPeerRef.current = peerId;

        const peer = new RTCPeerConnection(RTC_CONFIGURATION);

        peerRef.current = peer;
        window.__webrtcPeer = peer;

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                console.log(
                    "[WebRTC] Local ICE candidate:",
                    event.candidate.candidate
                );

                if (socketRef.current && targetPeerRef.current) {
                    socket.emit("webrtc:ice-candidate", {
                        target: targetPeerRef.current,
                        candidate: event.candidate,
                    });
                }
            } else {
                console.log("[WebRTC] ICE candidate gathering completed.");
            }
        };

        peer.onnegotiationneeded = async () => {
            try {

                if (peer !== peerRef.current) return;
                if (peer.signalingState !== "stable") return;
                makingOfferRef.current = true;

                await peer.setLocalDescription();

                if (
                    peer !== peerRef.current ||
                    socketRef.current !== socket ||
                    !socket.connected ||
                    !targetPeerRef.current
                ) {
                    return;
                }

                socket.emit("webrtc:offer", {
                    target: targetPeerRef.current,
                    description: peer.localDescription,
                });

                console.log("[WebRTC] Negotiation offer sent.");
            } catch (err) {
                console.error("[WebRTC] Negotiation error:", err);
                setError(`Could not renegotiate connection: ${err.message}`);
            } finally {
                makingOfferRef.current = false;
            }
        };

        peer.onconnectionstatechange = () => {
            if (peerRef.current !== peer) return;

            const state = peer.connectionState;

            console.log("[WebRTC] Connection state:", state);
            console.log("[WebRTC] ICE state:", peer.iceConnectionState);
            console.log("[WebRTC] Signaling state:", peer.signalingState);

            if (state === "failed") {
                setRoomStatus("failed");
                addMessage(
                    `Peer connection failed. ICE state: ${peer.iceConnectionState}`,
                    "system"
                );
            } else if (state === "disconnected") {
                setRoomStatus("disconnected");
            } else if (state === "connected") {
                setRoomStatus("connected");

                if (roomStatus !== "connected") {
                    addMessage("Peer connection established.", "system");
                }
            }
        };


        peer.oniceconnectionstatechange = async () => {
            console.log(
                "[WebRTC] ICE connection state:",
                peer.iceConnectionState
            );

            try {
                const stats = await peer.getStats();

                stats.forEach((report) => {
                    if (report.type === "candidate-pair") {
                        console.log("[WebRTC] Candidate Pair:", {
                            state: report.state,
                            nominated: report.nominated,
                            selected: report.selected,
                            localCandidateId: report.localCandidateId,
                            remoteCandidateId: report.remoteCandidateId,
                            currentRoundTripTime: report.currentRoundTripTime,
                            bytesSent: report.bytesSent,
                            bytesReceived: report.bytesReceived,
                        });
                    }

                    if (report.type === "local-candidate") {
                        console.log("[WebRTC] Local Candidate:", {
                            candidateType: report.candidateType,
                            protocol: report.protocol,
                            address: report.address,
                            port: report.port,
                        });
                    }

                    if (report.type === "remote-candidate") {
                        console.log("[WebRTC] Remote Candidate:", {
                            candidateType: report.candidateType,
                            protocol: report.protocol,
                            address: report.address,
                            port: report.port,
                        });
                    }
                });
            } catch (err) {
                console.error(
                    "[WebRTC] Could not retrieve ICE stats:",
                    err
                );
            }
        };
        peer.onsignalingstatechange = () => {
            console.log("[WebRTC] Signaling state:", peer.signalingState);
        };

        peer.ondatachannel = (event) => {
            setupDataChannel(event.channel);
        };

        // Handle incoming audio and video tracks.
        peer.ontrack = (event) => {
            let remoteStream = remoteStreamRef.current;

            if (!remoteStream) {
                remoteStream = new MediaStream();
                remoteStreamRef.current = remoteStream;
            }

            const incomingTrack = event.track;

            const alreadyAdded = remoteStream
                .getTracks()
                .some((track) => track.id === incomingTrack.id);

            if (!alreadyAdded) {
                remoteStream.addTrack(incomingTrack);
            }

            setRemoteStream(remoteStream);

            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = remoteStream;
            }

            addMessage(
                `Incoming ${incomingTrack.kind} track received from peer.`,
                "system"
            );
        };

        const localStream = streamRef.current;

        if (localStream) {
            localStream.getTracks().forEach((track) => {
                peer.addTrack(track, localStream);
            });

            console.log("[WebRTC] Existing local media tracks added.");
        }

        return peer;
    }, [addMessage, closePeer, setupDataChannel]);

    const flushPendingCandidates = useCallback(async (peer) => {
        const candidates = pendingCandidatesRef.current.splice(0);

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
        socketRef.current?.disconnect();
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
        setMessages([]);
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
                socketRef.current = null;
            }
        });

        socket.on("webrtc:joined", ({ peerId, initiator }) => {
            initiatorRef.current = initiator;
            addMessage(
                initiator
                    ? `Room "${cleanRoom}" created. Waiting for another peer.`
                    : `Joined room "${cleanRoom}". Connecting to peer...`,
                "system",
            );

            if (peerId) {
                createPeer(socket, peerId);
            }
        });

        socket.on("webrtc:peer-joined", async ({ peerId }) => {
            if (peerRef.current) return;

            try {
                addMessage(
                    "Another peer joined. Preparing secure connection...",
                    "system"
                );

                const peer = createPeer(socket, peerId);

                const channel = peer.createDataChannel("futrona-messages");

                setupDataChannel(channel);

            } catch (err) {
                console.error("WebRTC offer error", err);
                setError(`Could not create connection offer: ${err.message}`);
                setRoomStatus("failed");
            }
        });

        socket.on("webrtc:offer", async ({ sender, description }) => {
            try {
                let peer = peerRef.current;

                if (!peer || targetPeerRef.current !== sender) {
                    peer = createPeer(socket, sender);
                }

                const polite = !initiatorRef.current;

                const readyForOffer =
                    !makingOfferRef.current &&
                    (peer.signalingState === "stable" ||
                        settingRemoteAnswerPendingRef.current
                    );

                const offerCollision =
                    description.type === "offer" && !readyForOffer;

                ignoreOfferRef.current = !polite && offerCollision;

                if (ignoreOfferRef.current) {
                    console.log("[WebRTC] ignoring colliding offer.");
                    return;
                }

                if (offerCollision && polite) {
                    await peer.setLocalDescription({ type: "rollback" });
                }

                await peer.setRemoteDescription(
                    new RTCSessionDescription(description),
                );


                await flushPendingCandidates(peer);

                if (description.type === "offer") {
                    await peer.setLocalDescription();

                    socket.emit("webrtc:answer", {
                        target: sender,
                        description: peer.localDescription,
                    });

                    console.log("[WebRTC] answer sent.");
                }


            } catch (err) {
                settingRemoteAnswerPendingRef.current = false;

                console.error("[WebRTC] Offer handling error:", err);
                setError(`Could not handle connection offer: ${err.message}`);
            }
        });

        socket.on("webrtc:answer", async ({ sender, description }) => {
            const peer = peerRef.current;

            if (!peer || targetPeerRef.current !== sender) {
                return;
            }

            try {
                settingRemoteAnswerPendingRef.current = true;

                await peer.setRemoteDescription(
                    new RTCSessionDescription(description)
                );

                await flushPendingCandidates(peer);

                console.log("[WebRTC] Remote answer received successfully.");
            } catch (err) {
                console.error("[WebRTC] Answer handling error:", err);
                setError(`Could not process connection answer: ${err.message}`);
            } finally {
                settingRemoteAnswerPendingRef.current = false;
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
            setRoomStatus("disconnected");
            addMessage("The other peer left the room.", "system");
        });
    };

    const handleFileSelect = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setFileError("");
        setSelectedFile(null);

        if (file.size > MAX_FILE_SIZE) {
            setFileError("File size must not exceed 100MB.");
            event.target.value = "";
            return;
        }

        setSelectedFile(file);

        console.log("Selected file:", file.name);

        event.target.value = "";
    };

    const sendFile = async () => {
        const file = selectedFile;
        const channel = channelRef.current;

        if (!file) {
            setFileError("Please select a file first.");
            return;
        }

        if (!channel || channel.readyState !== "open") {
            setFileError("Connect to a peer before sending files.");
            return;
        }

        if (fileTransferRef.current) {
            setFileError("A file transfer is already in progress.");
            return;
        }

        const transferId = crypto.randomUUID();

        fileTransferRef.current = {
            id: transferId,
        };

        setFileError("");

        setFileTransfer({
            status: "sending",
            progress: 0,
            transferred: 0,
            total: file.size,
            fileName: file.name,
        });

        try {
            channel.send(
                JSON.stringify({
                    __futronaFileTransfer: true,
                    type: "file-start",
                    id: transferId,
                    name: file.name,
                    size: file.size,
                    mimeType: file.type || "application/octet-stream",
                })
            );

            let offset = 0;
            let lastProgress = -1;

            while (offset < file.size) {
                if (
                    fileTransferRef.current?.id !== transferId ||
                    channel.readyState !== "open"
                ) {
                    throw new Error("File transfer interrupted.");
                }

                while (channel.bufferedAmount > MAX_BUFFER_SIZE) {
                    if (channel.readyState !== "open") {
                        throw new Error("Datachannel Connection closed.")
                    }

                    await new Promise((resolve) => setTimeout(resolve, 20));
                }

                const chunk = await file
                    .slice(offset, offset + CHUNK_SIZE)
                    .arrayBuffer();

                channel.send(chunk);

                offset += chunk.byteLength;

                const progress = file.size === 0
                    ? 100
                    : Math.round((offset / file.size) * 100);

                if (progress !== lastProgress) {
                    lastProgress = progress;

                    setFileTransfer((previous) => ({
                        ...previous,
                        status: "sending",
                        transferred: offset,
                        progress,
                    }));
                }
            }

            channel.send(
                JSON.stringify({
                    __futronaFileTransfer: true,
                    type: "file-end",
                    id: transferId,
                })
            );

            setFileTransfer({
                status: "complete",
                progress: 100,
                transferred: file.size,
                total: file.size,
                fileName: file.name,
            });

            addMessage(`File sent: ${file.name}`, "system");

            setSelectedFile(null);
        } catch (err) {
            console.error("[WebRTC] file sending error:", err);

            setFileTransfer((previous) => ({
                ...previous,
                status: "failed",
            }));

            setFileError(err.message || "Could not send file.");
        } finally {
            if (fileTransferRef.current?.id === transferId) {
                fileTransferRef.current = null;
            }
        }
    };

    const downloadReceivedFile = () => {
        if (!receivedFile?.blob) return;

        const url = URL.createObjectURL(receivedFile.blob);

        const link = document.createElement("a");
        link.ref = url;
        link.download = receivedFile.name;

        document.body.appendChild(link);
        link.click()
        link.remove();

        window.setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
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

            const peer = peerRef.current;

            if (peer) {
                const existingTrackIds = new Set(
                    peer.getSenders()
                        .map((sender) => sender.track?.id)
                        .filter(Boolean)
                );

                stream.getTracks().forEach((track) => {
                    if (!existingTrackIds.has(track.id)) {
                        peer.addTrack(track, stream);
                    }
                });
            }

            setAudioEnabled(true);
            setVideoEnabled(true);
            setStatus("active");

            if (!peer) {
                addMessage(
                    "Local media added. Tracks will be added when a peer connects.",
                    "system"
                );
            }
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
                <div className="webrtc-experiments__video-grid">
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
                                <p>Your local preview will appear here</p>
                            </div>
                        )}

                        <div className="webrtc-experiments__video-label">
                            <span className={status === "active" ? "is-active" : ""} />
                            {status === "active" ? "LOCAL STREAM ACTIVE" : "LOCAL STREAM STANDBY"}
                        </div>
                    </div>

                    <div className="webrtc-experiments__video">
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            aria-label="Remote peer video"
                        />

                        {!remoteStream && (
                            <div className="webrtc-experiments__placeholder">
                                <span className="webrtc-experiments__placeholder-icon">◎</span>
                                <p>Waiting for remote peer video...</p>
                            </div>
                        )}

                        <div className="webrtc-experiments__video-label">
                            <span className={remoteStream ? "is-active" : ""} />
                            {remoteStream ? "REMOTE STREAM ACTIVE" : "REMOTE STREAM STANDBY"}
                        </div>
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

                    <span className={`webrtc-experiments__connection-state ${connected ? "is-connected" : ""}`}>
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
                    {messages.length === 0 ? (
                        <p className="webrtc-experiments__empty">
                            Join the same room in another tab to start the connection.
                        </p>
                    ) : (
                        messages.map((item) => (
                            <div
                                className={`webrtc-experiments__message is-${item.sender}`}
                                key={item.id}
                            >
                                <span>
                                    {item.sender === "you"
                                        ? "YOU"
                                        : item.sender === "peer"
                                            ? "PEER"
                                            : "SYSTEM"}
                                </span>
                                <p>{item.text}</p>
                                <time>{item.time}</time>
                            </div>
                        ))
                    )}
                </div>

                <div className="webrtc-experiments__file-transfer">

                    <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        onChange={handleFileSelect}
                    />

                    <div className="webrtc-experiments__file-info">
                        <span>FILE TRANSFER / PEER TO PEER</span>
                        <p>
                            {selectedFile
                                ? `${selectedFile.name} - ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                                : "Select a file to share with your peer."}
                        </p>
                    </div>

                    <div className="webrtc-experiments__file-actions">
                        <button
                            className="webrtc-experiments__select-file"
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={fileTransfer.status === "sending"}
                        >
                            Select File
                        </button>

                        <button
                            className="webrtc-experiments__send-file"
                            type="button"
                            onClick={sendFile}
                            disabled={
                                !selectedFile ||
                                !connected ||
                                fileTransfer.status === "sending"
                            }
                        >
                            {fileTransfer.status === "sending"
                                ? "Sending..."
                                : "Send File ↗"}
                        </button>
                    </div>

                    {(fileTransfer.status === "sending" ||
                        fileTransfer.status === "receiving" ||
                        fileTransfer.status === "complete") && (
                            <div className="webrtc-experiments__transfer-progress">
                                <p>
                                    {fileTransfer.status === "sending"
                                        ? "Sending file..."
                                        : fileTransfer.status === "receiving"
                                            ? "Receiving file..."
                                            : "Transfer complete"}
                                </p>

                                <progress value={fileTransfer.progress}
                                    max={100}
                                />
                                <span>{fileTransfer.progress}%</span>
                                <p>{fileTransfer.fileName}</p>
                                <p>
                                    {(fileTransfer.transferred / (1024 * 1024)).toFixed(2)}
                                    {" / "}
                                    {(fileTransfer.total / (1024 * 1024)).toFixed(2)}
                                    {" MB"}
                                </p>
                            </div>
                        )}

                    {receivedFile && (
                        <div className="webrtc-experiments__received-file">
                            <p>Received: {receivedFile.name}</p>

                            <button
                                type="button"
                                onClick={downloadReceivedFile}
                            >
                                download Received File ↓
                            </button>
                        </div>
                    )}

                    {fileError && (
                        <p className="webrtc-experiments__error" role="alert">
                            {fileError}
                        </p>
                    )}

                </div>

                <form className="webrtc-experiments__message-form" onSubmit={sendMessage}>
                    <input
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
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
