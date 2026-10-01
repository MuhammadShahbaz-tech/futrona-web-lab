import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

function Object3D() {
    const meshRef = useRef();

    useFrame((state) => {
        if (!meshRef.current) return;

        const targetX = state.pointer.y * 0.6;
        const targetY = state.pointer.x * 0.6;

        meshRef.current.rotation.x +=
            (targetX - meshRef.current.rotation.x) * 0.08;

        meshRef.current.rotation.y +=
            (targetY - meshRef.current.rotation.y) * 0.08;

        meshRef.current.rotation.z += 0.003;
    });

    return (
        <mesh ref={meshRef}>
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