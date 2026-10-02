import { Canvas } from "@react-three/fiber";
import Object3D from "./Object";
import { DirectionalLight } from "three";

function Scene() {
    return (
        <Canvas
            camera={{
                position: [0, 0, 5],
                fov: 45,
            }}>

            <fog attach="fog" args={["#111111", 4, 10]} />
            <ambientLight intensity={1} />

            <directionalLight
                position={[2, 2, 3]}
                intensity={2}
            />

            <Object3D />

            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -1.2, 0]}
            >
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial
                    color="#111111"
                    metalness={0.3}
                    roughness={0.8} />
            </mesh>
        </Canvas>
    );
}

export default Scene;