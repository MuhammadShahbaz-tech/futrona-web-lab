import { useEffect } from "react";
import "./Motion.css";

import motionAnimation from "../../animations/motion/motionAnimation";
import motionScrollAnimation from "../../animations/motion/motionScrollAnimation";
import motionMouseAnimation from "../../animations/motion/motionMouseAnimation";
import magneticArrowAnimation from "../../animations/motion/magneticArrowAnimation";

import Hero from "../../sections/Motion/Hero/Hero";
import Introduction from "../../sections/Motion/Introduction/Introduction";
import Experiments from "../../sections/Motion/Experiments/Experiments";

function Motion() {
    useEffect(() => {
        const cleanupMotion = motionAnimation();
        const cleanupScroll = motionScrollAnimation();
        const cleanupMouse = motionMouseAnimation();
        const cleanupMagnetic = magneticArrowAnimation();

        return () => {
            cleanupMotion?.();
            cleanupScroll?.();
            cleanupMouse?.();
            cleanupMagnetic?.();
        };
    }, []);

    return (
        <main className="motion-page">
            <Hero />
            <Introduction />
            <Experiments />
        </main>
    );
}

export default Motion;