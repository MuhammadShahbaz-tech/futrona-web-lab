
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./Experiments.css";

const SERVER_URL = "http://localhost:4000";

const Experiments = () => {
    const socketRef = useRef(null);

    const [events, setEvents] = useState([
        {
            id: 1,
            type: "System",
            message: "Real-time interface initialized.",
            timestamp: new Date().toISOString(),
        },
        {
            id: 2,
            type: "Connect",
            message: "Event Stream ready.",
            timestamp: new Date().toISOString(),
        },
        {
            id: 3,
            type: "Sync",
            message: "Waiting for your first event",
            timestamp: new Date().toISOString(),
        },
    ]);

    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socket = io(SERVER_URL);
        setSocket(socket);
        socketRef.current = socket;

        socket.on("connect", () => {
            setConnected(true);

            setEvents((previous) => [
                {
                    id: `connect-${Date.now()}`,
                    type: "Connect",
                    message: "Connected to FUTRONA real-time server.",
                    timestamp: new Date().toISOString(),
                },
                ...previous,
            ].slice(0, 8));
        });

        socket.on("disconnect", () => {
            setConnected(false);

            setEvents((previous) => [
                {
                    id: `disconnect-${Date.now()}`,
                    type: "System",
                    message: "Server connection lost.",
                    timestamp: new Date().toISOString(),
                },
                ...previous,
            ].slice(0, 8));
        });

        socket.on("realtime:status", (data) => {
            setEvents((previous) => [
                {
                    id: `status-${Date.now()}`,
                    type: "System",
                    message: data.message,
                    timestamp: data.timestamp,
                },
                ...previous,
            ].slice(0, 8));
        });

        socket.on("realtime:event", (event) => {
            setEvents((previous) => [
                {
                    id: event.id,
                    type: "Live",
                    message: event.message,
                    timestamp: event.timestamp,
                },
                ...previous,
            ].slice(0, 8));
        });

        return () => {
            setSocket(null);
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    const triggerEvent = () => {
        if (!socket?.connected) return;

        socket.emit("realtime:event", {
            message:"Test event sent from Futrona Experiments",
        });
    };

    return (
        <section
            className="realtime-experiments"
            id="realtime-experiments"
        >
            <div className="realtime-experiments__top">
                <span>02 / Experiments</span>
                <span>Interactive Event Stream</span>
            </div>

            <div className="realtime-experiments__heading">
                <p className="realtime-experiments__eyebrow">
                    Events in motion
                </p>

                <h2>
                    Every Second.
                    <br />
                    <span>A new signal.</span>
                </h2>

                <p className="realtime-experiments__description">
                    Trigger events and watch the interface respond instantly.
                    This live event stream receives updates from the server.
                </p>
            </div>

            <div className="realtime-experiments__panel">
                <div className="realtime-experiments__panel-header">
                    <div className="realtime-experiments__connection">
                        <span
                            className="realtime-experiments__status-dot"
                            style={{
                                backgroundColor: connected
                                    ? "#64e4d2"
                                    : "#ff6b6b",
                            }}
                        />

                        {connected
                            ? "Server Connected"
                            : "Disconnected"}
                    </div>

                    <span>
                        {String(events.length).padStart(2, "0")} EVENTS
                    </span>
                </div>

                <div
                    className="realtime-experiments__feed"
                    aria-live="polite"
                >
                    {events.map((event) => (
                        <article
                            className="realtime-experiments__event"
                            key={event.id}
                        >
                            <span className="realtime-experiments__event-type">
                                {event.type}
                            </span>

                            <p>{event.message}</p>

                            <span className="realtime-experiments__event-time">
                                {new Date(
                                    event.timestamp
                                ).toLocaleTimeString()}
                            </span>
                        </article>
                    ))}
                </div>

                <div className="realtime-experiments__actions">
                    <p>
                        {connected
                            ? "The live server is connected."
                            : "Waiting for the server connection..."}
                    </p>

                    <button
                        type="button"
                        onClick={triggerEvent}
                        disabled={!connected}
                    >
                        Trigger Event{" "}
                        <span aria-hidden="true">↗</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Experiments;
