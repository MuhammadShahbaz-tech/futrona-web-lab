// import { useState } from "react";
import "./WebRTC.css";

import Hero from "../../sections/WebRTC/Hero/Hero";
import Introduction from "../../sections/WebRTC/Introduction/Introduction";
import Experiments from "../../sections/WebRTC/Experiments/Experiments";

function WebRTC() {
    return (
        <main className="webrtc">
            <Hero />
            <Introduction />
            <Experiments />
        </main>
    );
}

export default WebRTC;