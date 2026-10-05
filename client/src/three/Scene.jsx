import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Object3D from "./Object";

gsap.registerPlugin(ScrollTrigger);

function CameraRig({ activeExperiment }) {
    useFrame((state) => {
        const camera = state.camera;

        let targetX = state.pointer.x * 0.5;
        let targetY = state.pointer.y * 0.3;
        let targetZ = 5;

        if (activeExperiment === "camera") {
            targetX = state.pointer.x * 1.2;
            targetY = state.pointer.y * 0.8;
            targetZ = 4;
        }
        camera.position.x +=
            (targetX - camera.position.x) * 0.03;

        camera.position.y +=
            (targetY - camera.position.y) * 0.03;

        camera.position.z +=
            (targetZ - camera.position.z) * 0.03;

        camera.lookAt(0, 0, 0);
    });

    return null;
}

function SceneMotion({ children }) {
    const groupRef = useRef();

    useEffect(() => {
        if (!groupRef.current) return;

        const trigger = document.querySelector(".threed-scene");

        if (!trigger) return;

        const ctx = gsap.context(() => {
            gsap.to(groupRef.current.rotation, {
                y: Math.PI * 0.5,
                x: 0.15,
                ease: "none",
                scrollTrigger: {
                    trigger,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                },
            });
        }, trigger);

        return () => ctx.revert();
    }, []);

    return (
        <group ref={groupRef}>
            {children}
        </group>
    );
}

function Scene({ activeExperiment }) {
    return (
        <Canvas
            shadows
            camera={{
                position: [0, 0, 5],
                fov: 45,
            }}
        >
            <fog attach="fog" args={["#111111", 4, 10]} />

            <CameraRig
                activeExperiment={activeExperiment}
            />

            <ambientLight intensity={1} />

            <directionalLight
                position={[3, 4, 5]}
                intensity={2.5}
                castShadow
            />

            <pointLight
                position={[-3, 2, 3]}
                intensity={18}
                distance={7}
                decay={2}
            />

            <SceneMotion>
                <Object3D
                    position={[0, 0, 0]}
                    scale={1}
                    interactionMode={
                        activeExperiment === "interaction"
                    }
                    metalness={
                        activeExperiment === "materials"
                            ? 1
                            : 0.8
                    }
                    roughness={
                        activeExperiment === "materials"
                            ? 0.05
                            : 0.2
                    }
                />

                <Object3D
                    position={[-2.2, 0.3, -1.5]}
                    scale={0.55}
                    interactionMode={
                        activeExperiment === "interaction"
                    }
                    metalness={
                        activeExperiment === "materials"
                            ? 0.9
                            : 0.4
                    }
                    roughness={
                        activeExperiment === "materials"
                            ? 0.1
                            : 0.5
                    }
                />

                <Object3D
                    position={[2.2, 0.3, -2]}
                    scale={0.55}
                    interactionMode={
                        activeExperiment === "interaction"
                    }
                    metalness={
                        activeExperiment === "materials"
                            ? 0.8
                            : 0.2
                    }
                    roughness={
                        activeExperiment === "materials"
                            ? 0.15
                            : 0.75
                    }
                />
            </SceneMotion>

            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -1.2, 0]}
                receiveShadow
            >
                <planeGeometry args={[10, 10]} />

                <meshStandardMaterial
                    color="#111111"
                    metalness={0.3}
                    roughness={0.8}
                />
            </mesh>
        </Canvas>
    );
}

export default Scene;