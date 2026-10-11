
import "./Introduction.css";

const Introduction = () => {
  return (
    <section
      className="webgpu-introduction"
      id="webgpu-introduction"
    >
      <div className="webgpu-introduction__header">
        <span>01 / THE NEXT COMPUTE LAYER</span>
        <span>WEBGPU / OVERVIEW</span>
      </div>

      <div className="webgpu-introduction__content">
        <p className="webgpu-introduction__eyebrow">
          FROM GRAPHICS TO GENERAL COMPUTE
        </p>

        <h2 className="webgpu-introduction__title">
          MORE CONTROL.
          <br />
          MORE POSSIBILITIES.
        </h2>

        <div className="webgpu-introduction__details">
          <p className="webgpu-introduction__statement">
            WebGPU opens a modern pathway to the GPU,
            bringing programmable graphics and general-purpose
            computation closer to the web.
          </p>

          <div className="webgpu-introduction__side">
            <p>
              Build richer visual systems, process parallel
              workloads, and explore a new generation of
              browser-based experiences.
            </p>

            <div className="webgpu-introduction__stats">
              <div>
                <span>01</span>
                <p>Programmable pipeline</p>
              </div>

              <div>
                <span>02</span>
                <p>Parallel computation</p>
              </div>

              <div>
                <span>03</span>
                <p>Modern GPU interface</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
