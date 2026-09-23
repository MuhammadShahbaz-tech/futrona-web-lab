import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Motion from "./pages/Motion/Motion";
import ThreeD from "./pages/ThreeD/ThreeD";
import WebGL from "./pages/WebGL/WebGL";
import WebGPU from "./pages/WebGPU/WebGPU";
import RealTime from "./pages/RealTime/RealTime";
import WebRTC from "./pages/WebRTC/WebRTC";
import WebAssembly from "./pages/WebAssembly/WebAssembly";
import AI from "./pages/AI/AI";
import Future from "./pages/Future/Future";

function App() {
    return (
        <BrowserRouter>
            <main className="app">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/motion" element={<Motion />} />
                    <Route path="/3d" element={<ThreeD />} />
                    <Route path="/webgl" element={<WebGL />} />
                    <Route path="/webgpu" element={<WebGPU />} />
                    <Route path="/realtime" element={<RealTime />} />
                    <Route path="/webrtc" element={<WebRTC />} />
                    <Route path="/webassembly" element={<WebAssembly />} />
                    <Route path="/ai" element={<AI />} />
                    <Route path="/future" element={<Future />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;