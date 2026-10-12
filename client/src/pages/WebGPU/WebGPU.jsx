import { useState } from "react";
import "./WebGPU.css";

import Hero from "../../sections/WebGPU/Hero/Hero";
import Introduction from "../../sections/WebGPU/Introduction/Introduction";
import Experiments from "../../sections/WebGPU/Experiments/Experiments";
import Canvas from "../../sections/WebGPU/Canvas/Canvas";

const WebGPU = () => {
  const [activeExperiment, setActiveExperiment] = useState(0);

  return (
    <main className="webgpu-page">
      <Hero />
      <Introduction />
      <Experiments onExperimentChange={setActiveExperiment} />
      <Canvas activeExperiment={activeExperiment} />
    </main>
  );
};

export default WebGPU;