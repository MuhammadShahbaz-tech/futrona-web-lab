import "./Introduction.css";

const Introduction = () => {
    const principles = [
        {
            number: "01",
            title: "Direct",
            description:
                "Browsers establish a peer-to-peer connection to exchange audio, video, or data.",
        },
        {
            number: "02",
            title: "Real-time",
            description:
                "Interactive communication with low latency, designed for experiences that respond instantly.",
        },
        {
            number: "03",
            title: "Secure",
            description:
                "WebRTC encrypts media and data in transit, helping protect communication between peers.",
        },
    ];

    return (
        <section
            className="webrtc-introduction"
            id="webrtc-introduction"
        >
            <div className="webrtc-introduction__top">
                <span>01 / The Technology</span>
                <span>Understanding WebRTC</span>
            </div>

            <div className="webrtc-introduction__content">
                <div className="webrtc-introduction__heading">
                    <p className="webrtc-introduction__eyebrow">
                        Communication without boundaries
                    </p>

                    <h2>
                        Not just connected.
                        <br />
                        <span>Connected directly.</span>
                    </h2>
                </div>

                <div className="webrtc-introduction__copy">
                    <p>
                        WebRTC enables browsers to communicate in real time,
                        sharing audio, video, and arbitrary data without
                        requiring a traditional media server in the middle.
                    </p>

                    <p>
                        A signaling mechanism helps peers find each other
                        and negotiate a connection. Network conditions may
                        still require STUN or TURN infrastructure.
                    </p>
                </div>
            </div>

            <div className="webrtc-introduction__principles">
                {principles.map((principle) => (
                    <article
                        className="webrtc-introduction__principle"
                        key={principle.number}
                    >
                        <span className="webrtc-introduction__number">
                            {principle.number}
                        </span>

                        <h3>{principle.title}</h3>

                        <p>{principle.description}</p>

                        <span
                            className="webrtc-introduction__arrow"
                            aria-hidden="true"
                        >
                            ↗
                        </span>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Introduction;