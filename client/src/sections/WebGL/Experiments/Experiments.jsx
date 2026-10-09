
import "./Experiments.css";

const experiments = [
  {
    number: "01",
    title: "SHADER SPACE",
    description:
      "Procedural radial waves generated on the GPU, responding to pointer movement.",
  },
  {
    number: "02",
    title: "LIQUID FIELD",
    description:
      "A fluid-like visual field shaped by animated mathematics and mouse interaction.",
  },
  {
    number: "03",
    title: "PARTICLE GRID",
    description:
      "A procedural grid of animated points rendered through a fragment shader.",
  },
];

const Experiments = ({
  activeExperiment,
  onExperimentChange,
}) => {
  const active = experiments[activeExperiment];

  return (
    <section className="webgl-experiments">
      <div className="webgl-experiments__header">
        <span>02 / EXPERIMENTS</span>
        <span>INTERACTIVE / GPU</span>
      </div>

      <div className="webgl-experiments__layout">
        <div className="webgl-experiments__intro">
          <p className="webgl-experiments__label">WEBGL LAB</p>

          <h2>
            TESTING
            <br />
            THE
            <br />
            PIXEL.
          </h2>

          <p className="webgl-experiments__description">
            Experimental graphics systems exploring how shaders,
            particles, mathematics, and interaction work together in real time.
          </p>
        </div>

        <div className="webgl-experiments__panel">
          <div className="webgl-experiments__panel-header">
            <span>{active.number}</span>
            <span>ACTIVE EXPERIMENT</span>
          </div>

          <div className="webgl-experiments__panel-content">
            <h3>{active.title}</h3>
            <p>{active.description}</p>
          </div>

          <div className="webgl-experiments__controls">
            {experiments.map((experiment, index) => (
              <button
                key={experiment.number}
                type="button"
                className={activeExperiment === index ? "is-active" : ""}
                aria-pressed={activeExperiment === index}
                onClick={() => onExperimentChange(index)}
              >
                <span>{experiment.number}</span>
                <span>{experiment.title}</span>
                <span>↗</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experiments;
