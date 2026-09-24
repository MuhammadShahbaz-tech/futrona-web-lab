import "./Motion.css";

function Motion() {
    return (
        <main className="motion-page">
            <section className="motion-hero section">
                <div className="container">
                    <div className="motion-hero__header">
                        <span className="motion-hero__number">
                            01 / Motion
                        </span>

                        <span className="motion-hero__label">
                            Future Web lab
                        </span>
                    </div>

                    <div className="motion-hero__content">
                        <p className="motion-hero__eyebrow">
                            Gsap / ScrollTrigger / Lenis
                        </p>

                        <h1 className="motion-hero__title">
                            motion
                            <span>Changes</span>
                            <span>Everything.</span>
                        </h1>

                        <p className="motion-hero__description">
                            Explore how movement transforms a static interface into an attractive experience
                        </p>
                    </div>
                </div>
            </section>

            <section className="motion-introduction section">
                <div className="container">
                    <div className="motion-introduction__header">
                        <span>02 / introduction</span>
                    </div>

                    <div className="motion-introduction__content">
                        <h2 className="motion-introduction__title">
                            Motion is not
                            <span>decoration.</span>
                            <span>it is communication.</span>
                        </h2>

                        <p className="motion-introduction__description">
                            Timing, movement and interaction create hierarchy,
                            guide attention and give digital interfaces a
                            sense of physical presence.
                        </p>
                    </div>
                </div>
            </section>

            <section className="motion-experiments section">
                <div className="container">
                    <div className="motion-experiments__header">
                        <span>03 / Experiments</span>
                        <p>Interactive studies <br /> in motion</p>
                    </div>

                    <div className="motion-experiments__list">
                        <article className="motion-experiment">
                            <span className="motion-experiment__number">
                                01
                            </span>

                            <div className="motion-experiment__info">
                                <h3>gsap</h3>
                                <p>High performance animation timelines and precise motion control</p>
                            </div>

                            <span className="motion-experiment__arrow">
                                ↗
                            </span>
                        </article>

                        <article className="motion-experiment">
                            <span className="motion-experiment__number"> 02</span>

                            <div className="motion-experiment__info">
                                <h3>ScrollTrogger</h3>

                                <p>scroll-driven animation that connects movement with the user's journey.</p>
                            </div>

                            <span className="motion-experiment__arrow">↗</span>
                        </article>

                        <article className="motion-experiment">
                            <span className="motion-experiment__number">03</span>
                            <div className="motion-experiment__info">
                                <h3>Lenis</h3>

                                <p>Smooth scrolling and controlled interaction between the user and the page</p>
                            </div>

                            <span className="motion-experiment__arrow">
                                ↗
                            </span>
                        </article>

                        <article className="motion-experiment">
                            <span className="motion-experiment__number">04</span>

                            <div className="motion-experiment__info">
                                <h3>View transitions</h3>
                                <p>seamless visual transitions between different interface states and pages.</p>
                            </div>
                            <span className="motion-experiment__arrow">
                                ↗
                            </span>
                        </article>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Motion;