import "./Introduction.css";

const Introduction = () => {
  return (
    <section className="webgl-introduction">
      <div className="webgl-introduction__header">
        <span>01 / INTRODUCTION</span>
        <span>GPU / REAL-TIME</span>
      </div>

      <div className="webgl-introduction__content">
        <h2>
          THE BROWSER
          <br />
          BECOMES
          <br />
          THE CANVAS.
        </h2>

        <div className="webgl-introduction__text">
          <p>
            WebGL brings hardware-accelerated graphics into the browser,
            allowing JavaScript to communicate directly with the GPU.
          </p>

          <p>
            From procedural visuals to interactive shaders, it transforms
            the browser from a document viewer into a real-time graphics
            environment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Introduction;