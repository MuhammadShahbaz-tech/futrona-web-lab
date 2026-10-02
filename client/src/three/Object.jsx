import { useFrame } from "@react-three/fiber";
import { use, useRef, useState } from "react";

function Object3D() {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (!meshRef.current) return;

        const targetX = state.pointer.y * 0.6;
        const targetY = state.pointer.x * 0.6;

        meshRef.current.rotation.x +=
            (targetX - meshRef.current.rotation.x) * 0.08;

        meshRef.current.rotation.y +=
            (targetY - meshRef.current.rotation.y) * 0.08;

        meshRef.current.rotation.z += 0.003;

        const targetScale = hovered ? 1.2 : 1;

        meshRef.current.scale.x +=
            (targetScale - meshRef.current.scale.x) * 0.08;

        meshRef.current.scale.y +=
            (targetScale - meshRef.current.scale.y) * 0.08;

        meshRef.current.scale.z +=
            (targetScale - meshRef.current.scale.z) * 0.08;
    });

    return (
        <mesh ref={meshRef}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
        >

            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial
                color="#ffffff"
                metalness={0.7}
                roughness={0.25}
            />
        </mesh>
    )
}

export default Object3D;