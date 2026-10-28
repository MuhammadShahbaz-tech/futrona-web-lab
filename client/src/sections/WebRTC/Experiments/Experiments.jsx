
import { useEffect, useRef, useState } from "react";
import "./Experiments.css";

const Experiments = () => {
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const [status, setStatus] = useState("idle");
    const [error, setError] = useState("");
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);

    useEffect(() => {
        return () => {
            streamRef.current?.getTracks().forEach((track) => track.stop());
        };
    }, []);

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
        </section>
    );
};

export default Experiments;
