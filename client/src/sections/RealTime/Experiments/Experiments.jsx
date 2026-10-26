import { useState } from "react";
import "./Experiments.css";

const Experiments = () => {
    const [events, setEvents] = useState([
        { id: 1, type: "System", message: "Real-time interface initialized." },
        { id: 2, type: "Connect", message: "Event Stream ready." },
        { id: 3, type: "Sync", message: "Waiting for your first event" },
    ]);

    const triggerEvent = () => {
        const messages = [
            "New data packet received.",
            "Client state synchronized.",
            "Live event broadcast completed.",
            "Connection heartbeat acknowledged.",
            "Real-time update processed.",
        ];

        const nextEvent = {
            id: Date.now(),
            type: "Live",
            message: messages[Math.floor(Math.random() * messages.length)],
        };

        setEvents((previous) => [nextEvent, ...previous].slice(0, 8));
    };

    return (
        <section className="realtime-experiments" id="realtime-experiments">
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
                    This local simulation demonstrates event-driven UI updates.
                </p>
            </div>

            <div className="realtime-experiments__panel">
                <div className="realtime-experiments__panel-header">
                    <div className="realtime-experiments__connection">
                        <span className="realtime-experiments__status-dot" />
                        LOCAL EVENT SIMULATION
                    </div>

                    <span>
                        {String(events.length).padStart(2, "0")} EVENTS
                    </span>
                </div>

                <div className="realtime-experiments__feed" aria-live="polite">
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
                                {new Date(event.id).toLocaleTimeString()}
                            </span>
                        </article>
                    ))}
                </div>

                <div className="realtime-experiments__actions">
                    <p>Generate an event to update the stream.</p>

                    <button type="button" onClick={triggerEvent}>
                        Trigger Event <span aria-hidden="true">↗</span>
                    </button>
                </div>
            </div>
            ```
        </section>
    )
}

export default Experiments;