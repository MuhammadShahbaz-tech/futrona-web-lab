import { useEffect } from "react";
import labPreviewAnimation from "../../../animations/home/labPreviewAnimation";



const technologies = [
    {
        number: "01",
        title: "MOTION",
        description: "GSAP, ScrollTrigger, Lenis & View Transitions",
        path: "/motion",
    },
    {
        number: "02",
        title: "3D",
        description: "Three.js, React Three Fiber & WebGL",
        path: "/3d",
    },
    {
        number: "03",
        title: "WEBGL",
        description: "Shaders, particles & GPU-powered visuals",
        path: "/webgl",
    },
    {
        number: "04",
        title: "WEBGPU",
        description: "Next-generation graphics & computation",
        path: "/webgpu",
    },
    {
        number: "05",
        title: "REAL-TIME",
        description: "WebSockets, Socket.IO & live systems",
        path: "/realtime",
    },
    {
        number: "06",
        title: "WEBRTC",
        description: "Camera, microphone & peer-to-peer experiences",
        path: "/webrtc",
    },
    {
        number: "07",
        title: "WEBASSEMBLY",
        description: "High-performance computation in the browser",
        path: "/webassembly",
    },
    {
        number: "08",
        title: "AI",
        description: "Intelligent interfaces & generative experiences",
        path: "/ai",
    },
];

function LabPreview() {

    useEffect(() => {
        const cleanup = labPreviewAnimation();

        return cleanup;
    }, []);
    return (
        <section className="home-lab-preview section">
            <div className="container">
                <div className="home-lab-preview__header">
                    <span>02 / THE LAB</span>

                    <p>
                        Explore the technologies
                        <br />
                        behind the experience.
                    </p>
                </div>

                <div className="home-lab-preview__list">
                    {technologies.map((technology) => (
                        <a
                            href={technology.path}
                            className="home-lab-preview__item"
                            key={technology.number}
                        >
                            <span className="home-lab-preview__number">
                                {technology.number}
                            </span>

                            <div className="home-lab-preview__info">
                                <h3>{technology.title}</h3>

                                <p>{technology.description}</p>
                            </div>

                            <span className="home-lab-preview__arrow">
                                ↗
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default LabPreview;