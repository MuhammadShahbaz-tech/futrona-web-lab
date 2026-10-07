import WebGL from "../../../pages/WebGL/WebGL";
import "./Hero.css";

const Hero = () => {
    return (
        <section className="webgl-hero">
            <div className="webgl-hero__content">
                <p className="webgl-hero__eyebrow">
                    04/Web Graphic
                </p>

                <div className="webgl-hero__meta">
                    <span>Futrona / 2026</span>
                </div>

                <h1 className="webgl-hero__title">
                    <span>Rendering</span>
                    <span>Beyond</span>
                    <span>The Screen.</span>
                </h1>

                <p className="webgl-hero__description">
                    Exploring GPU-powered graphics, shaders, and real-time visual
                    experiences directly in the browser.
                </p>
            </div>
        </section>
    );
};

export default Hero;