import "./WebGPU.css";
import Hero from "../../sections/WebGPU/Hero/Hero";
import Introduction from "../../sections/WebGPU/Introduction/Introduction";
import Experiments from "../../sections/WebGPU/Experiments/Experiments";
import Canvas from "../../sections/WebGPU/Canvas/Canvas";


function WebGPU() {
    return (
        <main className="webgpu-page">
            <Hero />
            <Introduction />
            <Experiments />
            <Canvas />
        </main>
    );
};

export default WebGPU;