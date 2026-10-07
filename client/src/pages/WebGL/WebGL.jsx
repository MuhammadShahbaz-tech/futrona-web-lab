import { useEffect } from "react";
import "./WebGL.css";


import Hero from "../../sections/WebGL/Hero/Hero";
import Introduction from "../../sections/WebGL/Introduction/Introduction";
import Experiments from "../../sections/WebGL/Experiments/Experiments";
import Canvas from "../../sections/WebGL/Canvas/Canvas";
import webGLHeroAnimation from "../../animations/webGL/webGLHeroAnimation";
import webGLIntroductionAnimation from "../../animations/webGL/webGLIntroductionAnimation";
import webGLExperimentsAnimation from "../../animations/webGL/webGLExperimentsAnimation";

const WebGL = () => {
    useEffect(() => {
        const cleanupHero = webGLHeroAnimation();
        const cleanupIntroduction = webGLIntroductionAnimation();
        const cleanupExperiment = webGLExperimentsAnimation();

        return () => {
            cleanupHero?.();
            cleanupIntroduction?.();
            cleanupExperiment?.();
        }
    }, []);

    return (
        <main className="webgl-page">
            <Hero />
            <Introduction />
            <Experiments />
            <Canvas />
        </main>
    );
};

export default WebGL;