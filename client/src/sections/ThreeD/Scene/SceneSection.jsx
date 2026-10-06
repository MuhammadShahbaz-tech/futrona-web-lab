import { useEffect, useRef } from "react";
import gsap from "gsap";
import Scene from "../../../three/Scene";

function SceneSection({ activeExperiment }) {
    const experimentData = {
        scene: {
            label: "SCENE",
            pointer: "TRACKING",
            object: "SPATIAL",
            render: "REAL-TIME",
            system: "Scene Active",
            description:
                "Spatial composition with multiple objects and real-time movement.",
        },
        materials: {
            label: "MATERIALS",
            pointer: "TRACKING",
            object: "SURFACE",
            render: "REAL-TIME",
            system: "Material Active",
            description:
                "Real-time surface response through metalness and roughness.",
        },
        camera: {
            label: "CAMERA",
            pointer: "ENHANCED",
            object: "PERSPECTIVE",
            render: "REAL-TIME",
            system: "Camera Active",
            description:
                "Interactive perspective controlled by pointer movement.",
        },
        interaction: {
            label: "INTERACTION",
            pointer: "ACTIVE",
            object: "INTERACTIVE",
            render: "REAL-TIME",
            system: "Interaction Active",
            description:
                "Objects respond directly to pointer movement and clicks.",
        },
    };

    const currentExperiment =
        experimentData[activeExperiment] ||
        experimentData.scene;
    
    const descriptionRef = useRef();

    useEffect(() => {
        if(!descriptionRef.current) return

        gsap.fromTo(
            descriptionRef.current,
            {
                y: 12,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                ease: "power3.out",
            }
        );
    }, [activeExperiment])

    return (
        <section className="threed-scene section">
            <div className="container">
                <div className="threed-scene__header">
                    <span>03 / LIVE SCENE</span>

                    <div className="threed-scene__header-info">
                        <span>{currentExperiment.label}</span>

                        <p ref={descriptionRef}>
                            {currentExperiment.description}
                        </p>
                    </div>
                </div>

                <div className="threed-scene__visual">
                    <Scene
                        activeExperiment={activeExperiment}
                    />
                </div>

                <div className="threed-scene__status">
                    <div className="threed-scene__status-item">
                        <span>POINTER RESPONSE</span>
                        <strong>
                            {currentExperiment.pointer}
                        </strong>
                    </div>

                    <div className="threed-scene__status-item">
                        <span>OBJECT STATE</span>
                        <strong>
                            {currentExperiment.object}
                        </strong>
                    </div>

                    <div className="threed-scene__status-item">
                        <span>RENDER MODE</span>
                        <strong>
                            {currentExperiment.render}
                        </strong>
                    </div>

                    <div className="threed-scene__status-item">
                        <span>System</span>
                        <strong>{currentExperiment.system}</strong>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SceneSection;