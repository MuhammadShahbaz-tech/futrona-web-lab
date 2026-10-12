
import { useEffect, useRef, useState } from "react";
import { initWebGPURenderer } from "../../../webgpu/webgpuRenderer";
import { initWebGLFallback } from "../../../webgpu/webglFallback";
import "./Canvas.css";

const Canvas = ({ activeExperiment = 0 }) => {
  const canvasRef = useRef(null);
  const fallbackCanvasRef = useRef(null);
  const rendererRef = useRef(null);

  const [status, setStatus] = useState("WEBGPU / INITIALIZING");
  const [rendererType, setRendererType] = useState("webgpu");

  useEffect(() => {
    let cancelled = false;
    let activeRenderer = null;

    const initialize = async () => {
      const webgpuCanvas = canvasRef.current;
      const webglCanvas = fallbackCanvasRef.current;

      if (!webgpuCanvas || !webglCanvas) return;

      let instance = await initWebGPURenderer(
        webgpuCanvas,
        (nextStatus) => {
          if (!cancelled) setStatus(nextStatus);
        }
      );

      if (cancelled) {
        instance?.destroy();
        return;
      }

      if (instance) {
        activeRenderer = instance;
        setRendererType("webgpu");
      } else {
        setStatus("SWITCHING TO WEBGL");

        instance = initWebGLFallback(webglCanvas, (nextStatus) => {
          if (!cancelled) setStatus(nextStatus);
        });

        if (cancelled) {
          instance?.destroy();
          return;
        }

        activeRenderer = instance;
        setRendererType("webgl");
      }

      rendererRef.current = activeRenderer;

      if (activeRenderer) {
        activeRenderer.setMode(activeExperiment);
      }
    };

    initialize().catch((error) => {
      console.error("FUTRONA renderer initialization failed:", error);

      if (!cancelled && fallbackCanvasRef.current) {
        const fallback = initWebGLFallback(
          fallbackCanvasRef.current,
          setStatus
        );

        if (cancelled) {
          fallback?.destroy();
          return;
        }

        activeRenderer = fallback;
        rendererRef.current = fallback;
        setRendererType("webgl");

        fallback?.setMode(activeExperiment);
      }
    });

    return () => {
      cancelled = true;
      activeRenderer?.destroy();
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    rendererRef.current?.setMode(activeExperiment);
  }, [activeExperiment]);

  return (
    <section className="webgpu-canvas" id="webgpu-canvas">
      <div className="webgpu-canvas__header">
        <span>03 / GPU CANVAS</span>
        <span>{status}</span>
      </div>

      <div className="webgpu-canvas__stage">
        <canvas
          ref={canvasRef}
          className="webgpu-canvas__element"
          style={{
            display: rendererType === "webgpu" ? "block" : "none",
          }}
          aria-label="Interactive WebGPU graphics canvas"
        />

        <canvas
          ref={fallbackCanvasRef}
          className="webgpu-canvas__element"
          style={{
            display: rendererType === "webgl" ? "block" : "none",
          }}
          aria-label="Interactive WebGL fallback graphics canvas"
        />

        <div className="webgpu-canvas__overlay">
          <span>REAL-TIME GPU VISUALIZATION</span>
          <span>
            EXPERIMENT / {String(activeExperiment + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="webgpu-canvas__center">
          <span className="webgpu-canvas__indicator" />
          <p>{status}</p>
        </div>

        <div className="webgpu-canvas__footer">
          <span>FUTRONA / WEBGPU LAB</span>
          <span>
            GRAPHICS / {rendererType === "webgl" ? "WEBGL FALLBACK" : "COMPUTE"}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Canvas;
