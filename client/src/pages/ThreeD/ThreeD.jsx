import { useEffect } from "react";
import "./ThreeD.css";

import threeDAnimation from "../../animations/threeD/threeDAnimation";

import Hero from "./../../sections/ThreeD/Hero/Hero";
import Introduction from "../../sections/ThreeD/Introduction/Introduction";
import Experiments from "../../sections/ThreeD/Experiments/Experiments";

function ThreeD() {
    useEffect(() => {
        const cleanupThreeD = threeDAnimation();

        return () =>{
            cleanupThreeD?.();
        };
    }, []);

    return (
        <main className="threed-page">
            <Hero />
            <Introduction />
            <Experiments/>
        </main>
    )
}

export default ThreeD;