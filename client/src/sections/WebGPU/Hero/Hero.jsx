import "./Hero.css";

const Hero = () => {
    return (
        <section className="webgpu-hero" id="webgpu">
            <div className="webgpu-hero__top">
                <span className="webgpu-hero__eyebrow">
                    05 / GPU Computing
                </span>

                <span className="webgpu-hero__meta">
                    Futrona / 2026
                </span>
            </div>

            <div className="webgpu-hero__content">
                <p className="webgpu-hero__label">
                    Beyond the Graphics Pipeline
                </p>

                <h1 className="webgpu-hero__title">
                    compute
                    <br />
                    Without
                    <br />
                    Limits<span>.</span>
                </h1>

                <div className="webgpu-hero__bottom ">
                    <p className="webgpu-hero__description">
                        Exploring next-generation GPU computing through
                        programmable graphics, parallel processing, and
                        real-time interactive experiences.                    
                    </p>

                    <a className="webgpu-hero__scroll"
                    href="#webgpu-introduction">
                        <span>Explore WebGPU</span>
                        <span aria-hidden="true">↘</span>
                    </a>
                </div>
            </div>

            <div className="webgpu-hero__visual" aria-hidden="true">
                <div className="webgpu-hero__orb webgpu-hero__orb--outer" />
                <div className="webgpu-hero__orb webgpu-hero--middle" />
                <div className="webgpu-hero__orb webgpu-hero__orb--inner" />
                    <span className="webgpu-hero__visual-label">
                        GPU / Compute Core
                    </span>
            </div>
        </section>
    );
};

export default Hero;