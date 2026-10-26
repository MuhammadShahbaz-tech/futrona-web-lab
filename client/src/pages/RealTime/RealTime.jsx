import { useState } from "react";
import "./RealTime.css";

import Hero from "../../sections/RealTime/Hero/Hero";
import Introduction from "../../sections/RealTime/Introduction/Introduction";
import Experiments from "../../sections/RealTime/Experiments/Experiments";

function RealTime() {
    return (
        <main className="real-time">
            <Hero />
            <Introduction />
            <Experiments />
        </main>
    );
}

export default RealTime;