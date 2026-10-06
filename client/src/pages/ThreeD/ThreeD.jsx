import { useEffect, useState } from "react";
import "./ThreeD.css";

import threeDAnimation from "../../animations/threeD/threeDAnimation";
import SceneSection from "../../sections/ThreeD/Scene/SceneSection";

import Hero from "./../../sections/ThreeD/Hero/Hero";
import Introduction from "../../sections/ThreeD/Introduction/Introduction";
import Experiments from "../../sections/ThreeD/Experiments/Experiments";

function ThreeD() {
    const [activeExperiment, setActiveExperiment] = useState("scene");

    
    useEffect(() => {
        const cleanupThreeD = threeDAnimation(
            activeExperiment
        );

        return () => {
            cleanupThreeD?.();
        };
    }, [activeExperiment]);

    return (
        <main className="threed-page">
            <Hero />
            <Introduction />
            <Experiments 
                activeExperiment={activeExperiment}
                setActiveExperiment={setActiveExperiment}
            />
            <SceneSection 
                activeExperiment={activeExperiment}
            />
        </main>
    )
}

export default ThreeD;