
import "./Hero.css";

const Hero = () => {
    return (
        <section className="realtime-hero" id="realtime">
            <div className="realtime-hero__top">
                <span className="realtime-hero__eyebrow">
                    06 / Real-Time Systems
                </span>

                <span className="realtime-hero__meta">
                    Futrona / 2026
                </span>
            </div>

            <div className="realtime-hero__content">
                <p className="realtime-hero__label">
                    The Web in Motion
                </p>

                <h1 className="realtime-hero__title">
                    always
                    <br />
                    In
                    <br />
                    Sync<span>.</span>
                </h1>

                <div className="realtime-hero__bottom">
                    <p className="realtime-hero__description">
                        Exploring real-time web experiences through live
                        data streams, instant communication, and connected
                        systems that respond as events happen.
                    </p>

                    <a
                        className="realtime-hero__scroll"
                        href="#realtime-introduction"
                    >
                        <span>Explore Real-Time</span>
                        <span aria-hidden="true">↘</span>
                    </a>
                </div>
            </div>

            <div className="realtime-hero__visual" aria-hidden="true">
                <div className="realtime-hero__ring realtime-hero__ring--outer" />
                <div className="realtime-hero__ring realtime-hero__ring--middle" />
                <div className="realtime-hero__ring realtime-hero__ring--inner" />
                <div className="realtime-hero__core" />
                <span className="realtime-hero__visual-label">
                    LIVE / CONNECTION CORE
                </span>
            </div>
        </section>
    );
};

export default Hero;
