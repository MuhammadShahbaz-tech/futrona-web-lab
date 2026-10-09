
import { useEffect, useState } from "react";
import "./WebGL.css";

import Hero from "../../sections/WebGL/Hero/Hero";
import Introduction from "../../sections/WebGL/Introduction/Introduction";
import Experiments from "../../sections/WebGL/Experiments/Experiments";
import Canvas from "../../sections/WebGL/Canvas/Canvas";

import webGLHeroAnimation from "../../animations/webGL/webGLHeroAnimation";
import webGLIntroductionAnimation from "../../animations/webGL/webGLIntroductionAnimation";
import webGLExperimentsAnimation from "../../animations/webGL/webGLExperimentsAnimation";

const WebGL = () => {
  const [activeExperiment, setActiveExperiment] = useState(0);

  useEffect(() => {
    const cleanupHero = webGLHeroAnimation();
    const cleanupIntroduction = webGLIntroductionAnimation();
    const cleanupExperiments = webGLExperimentsAnimation();

    return () => {
      cleanupHero?.();
      cleanupIntroduction?.();
      cleanupExperiments?.();
    };
  }, []);

  return (
    <main className="webgl-page">
      <Hero />
      <Introduction />

      <Experiments
        activeExperiment={activeExperiment}
        onExperimentChange={setActiveExperiment}
      />

      <Canvas activeExperiment={activeExperiment} />
    </main>
  );
};

export default WebGL;
