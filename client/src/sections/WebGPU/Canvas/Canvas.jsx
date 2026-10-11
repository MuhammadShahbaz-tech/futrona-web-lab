
import "./Canvas.css";

const Canvas = ({ activeExperiment = 0 }) => {
  return (
    <section className="webgpu-canvas" id="webgpu-canvas">
      <div className="webgpu-canvas__header">
        <span>03 / GPU CANVAS</span>
        <span>WEBGPU / INITIALIZING</span>
      </div>

      <div className="webgpu-canvas__stage">
        <canvas
          className="webgpu-canvas__element"
          aria-label="Interactive WebGPU graphics canvas"
        />

        <div className="webgpu-canvas__overlay">
          <span>REAL-TIME GPU VISUALIZATION</span>
          <span>
            EXPERIMENT / {String(activeExperiment + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="webgpu-canvas__center">
          <span className="webgpu-canvas__indicator" />
          <p>GPU RENDERING SURFACE</p>
        </div>

        <div className="webgpu-canvas__footer">
          <span>FUTRONA / WEBGPU LAB</span>
          <span>GRAPHICS / COMPUTE</span>
        </div>
      </div>
    </section>
  );
};

export default Canvas;
