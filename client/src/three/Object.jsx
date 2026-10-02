import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";

function Object3D({
    position = [0, 0, 0],
    scale = 1,
    metalness = 0.7,
    roughness = 0.25,
}) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false);

    useFrame((state) => {
        if (!meshRef.current) return;

        const targetX = state.pointer.y * 0.4;
        const targetY = state.pointer.x * 0.4;

        meshRef.current.rotation.x +=
            (targetX - meshRef.current.rotation.x) * 0.08;

        meshRef.current.rotation.y +=
            (targetY - meshRef.current.rotation.y) * 0.08;

        meshRef.current.rotation.z += active ? 0.012 : 0.003;

        const time = state.clock.getElapsedTime();

        meshRef.current.position.y +=
            (position[1] + Math.sin(time * 1.2 + position[0]) * 0.08 -
                meshRef.current.position.y) * 0.03;

        const targetScale = active ? 1.25 : hovered ? 1.12 : 1;

        meshRef.current.scale.x +=
            (targetScale - meshRef.current.scale.x) * 0.08;

        meshRef.current.scale.y +=
            (targetScale - meshRef.current.scale.y) * 0.08;

        meshRef.current.scale.z +=
            (targetScale - meshRef.current.scale.z) * 0.08;
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
    )
}

export default Object3D;