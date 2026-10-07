import { useEffect, useRef } from "react";
import "./Canvas.css";

import webglRenderer from "../../../webgl/webglRenderer";

const Canvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const cleanup = webglRenderer(canvas);
 
    return () => {
        cleanup?.();
    };
    
    const context =
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");

    if (!context) {
      console.error("WebGL is not supported by this browser.");
      return;
    }

    context.clearColor(0, 0, 0, 1);
    context.clear(context.COLOR_BUFFER_BIT);
  }, []);

  return (
    <section className="webgl-canvas">
      <div className="webgl-canvas__header">
        <span>03 / CANVAS</span>
        <span>WEBGL / LIVE</span>
      </div>

      <div className="webgl-canvas__stage">
        <canvas
          ref={canvasRef}
          className="webgl-canvas__element"
        />

        <div className="webgl-canvas__overlay">
          <span>LIVE GRAPHICS</span>
          <span>GPU / ACTIVE</span>
        </div>
      </div>
    </section>
  );
};

export default Canvas;