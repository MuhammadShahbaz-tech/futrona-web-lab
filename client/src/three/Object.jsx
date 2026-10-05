import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

function Object3D({
    position = [0, 0, 0],
    scale = 1,
    metalness = 0.7,
    roughness = 0.25,
    interactionMode = false,
}) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false);

    useFrame((state) => {
        if (!meshRef.current) return;

        const rotationStrength = interactionMode
            ? 0.9
            : 0.4;

        const targetX = state.pointer.y * rotationStrength;
        const targetY = state.pointer.x * rotationStrength;

        meshRef.current.rotation.x +=
            (targetX - meshRef.current.rotation.x) * 0.08;

        meshRef.current.rotation.y +=
            (targetY - meshRef.current.rotation.y) * 0.08;

        const rotationSpeed = interactionMode
            ? active
                ? 0.025
                : 0.008
            : active   
                ? 0.012
                : 0.003

        meshRef.current.rotation.z += rotationSpeed;

        const time = state.clock.getElapsedTime();

        meshRef.current.position.y +=
            (
                position[1] +
                Math.sin(time * 1.2 + position[0]) * 0.08 -
                meshRef.current.position.y
            ) * 0.03;

        const hoverScale = interactionMode
            ? 1.2
            : 1.12;

        const activeScale = interactionMode
            ? 1.35
            : 1.25        

        const targetScale = active
            ? activeScale
            : hovered
                ? hoverScale
                : 1;

        meshRef.current.scale.x +=
            (targetScale * scale - meshRef.current.scale.x) * 0.08;

        meshRef.current.scale.y +=
            (targetScale * scale - meshRef.current.scale.y) * 0.08;

        meshRef.current.scale.z +=
            (targetScale * scale - meshRef.current.scale.z) * 0.08;
    });

    return (
        <mesh
            ref={meshRef}
            position={position}
            scale={scale}
            castShadow
            receiveShadow
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onClick={() => setActive((current) => !current)}
        >
            <boxGeometry args={[0.7, 0.7, 0.7]} />

            <meshStandardMaterial
                color="#ffffff"
                metalness={metalness}
                roughness={roughness}
            />
        </mesh>
    );
}

export default Object3D;