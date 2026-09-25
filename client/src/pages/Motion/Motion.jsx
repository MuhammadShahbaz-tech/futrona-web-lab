import { useEffect } from "react";
import "./Motion.css";

import motionAnimation from "../../animations/motion/motionAnimation";

import Hero from "../../sections/Motion/Hero/Hero";
import Introduction from "../../sections/Motion/Introduction/Introduction";
import Experiments from "../../sections/Motion/Experiments/Experiments";

function Motion() {
    useEffect(() => {
        const cleanup = motionAnimation();

        return cleanup;
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