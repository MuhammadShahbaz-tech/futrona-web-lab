
import { useState } from "react";
import "./Experiments.css";

const experiments = [
  {
    number: "01",
    title: "COMPUTE SHADER",
    category: "PARALLEL PROCESSING",
    description:
      "Explore how GPU compute workloads process large amounts of data in parallel, beyond traditional graphics rendering.",
    detail: "DATA / PARALLEL",
  },
  {
    number: "02",
    title: "GPU PARTICLES",
    category: "SIMULATION",
    description:
      "Discover how thousands of particle positions can be updated through GPU computation for responsive visual simulations.",
    detail: "SYSTEM / PARTICLES",
  },
  {
    number: "03",
    title: "RENDER PIPELINE",
    category: "GRAPHICS",
    description:
      "Explore the programmable stages that transform geometry into pixels through a modern GPU rendering pipeline.",
    detail: "PIPELINE / RENDER",
  },
  {
    number: "04",
    title: "ENERGY WAVES",
    category: "INTERACTIVE GRAPHICS",
    description:
      "Explore flowing energy waves, luminous blue filaments, and cursor-responsive light in a real-time visual field.",
    detail: "LIGHT / ENERGY",
  },
  {
    number: "05",
    title: "CURSOR FIELD",
    category: "POINTER INTERACTION",
    description:
      "Interact with a responsive light field where glowing energy follows your cursor and creates dynamic visual reactions.",
    detail: "INPUT / RESPONSE",
  },
];

const Experiments = ({ onExperimentChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const selectExperiment = (index) => {
    setActiveIndex(index);
    onExperimentChange?.(index);
  };

  const activeExperiment = experiments[activeIndex];

  return (
    <section className="webgpu-experiments" id="webgpu-experiments">
      <div className="webgpu-experiments__header">
        <span>02 / GPU LABORATORY</span>
        <span>SELECT AN EXPERIMENT</span>
      </div>

      <div className="webgpu-experiments__intro">
        <p>INTERACTIVE COMPUTING</p>
        <h2>
          EXPLORE THE
          <br />
          PROCESSOR.
        </h2>
      </div>

      <div className="webgpu-experiments__layout">
        <div className="webgpu-experiments__list">
          {experiments.map((experiment, index) => (
            <button
              className={`webgpu-experiments__item ${activeIndex === index ? "is-active" : ""
                }`}
              key={experiment.number}
              type="button"
              aria-pressed={activeIndex === index}
              onClick={() => selectExperiment(index)}
            >
              <span className="webgpu-experiments__number">
                {experiment.number}
              </span>

              <span className="webgpu-experiments__item-title">
                {experiment.title}
              </span>

              <span className="webgpu-experiments__arrow" aria-hidden="true">
                ↗
              </span>
            </button>
          ))}
        </div>

        <div className="webgpu-experiments__detail" aria-live="polite">
          <span className="webgpu-experiments__category">
            {activeExperiment.category}
          </span>

          <h3>{activeExperiment.title}</h3>

          <p>{activeExperiment.description}</p>

          <div className="webgpu-experiments__detail-footer">
            <span>{activeExperiment.detail}</span>
            <span>EXPERIMENT {activeExperiment.number}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experiments;
