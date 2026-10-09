
import { useEffect, useRef } from "react";
import "./Canvas.css";

import webglRenderer from "../../../webgl/webglRenderer";

const Canvas = ({ activeExperiment }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const cleanup = webglRenderer(canvas, activeExperiment);

    return () => {
      cleanup?.();
    };
  }, [activeExperiment]);

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
