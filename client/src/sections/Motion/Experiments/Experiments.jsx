function Experiments() {
    return (
        <section className="motion-experiments section">
            <div className="container">
                <div className="motion-experiments__header">
                    <span>03 / EXPERIMENTS</span>

                    <p>
                        Interactive studies
                        <br />
                        in motion.
                    </p>
                </div>

                <div className="motion-experiments__list">
                    <article className="motion-experiment">
                        <span className="motion-experiment__number">
                            01
                        </span>

                        <div className="motion-experiment__info">
                            <h3>GSAP</h3>

                            <p>
                                High-performance animation timelines and
                                precise motion control.
                            </p>
                        </div>

                        <span className="motion-experiment__arrow">
                            ↗
                        </span>
                    </article>

                    <article className="motion-experiment">
                        <span className="motion-experiment__number">
                            02
                        </span>

                        <div className="motion-experiment__info">
                            <h3>SCROLLTRIGGER</h3>

                            <p>
                                Scroll-driven animation that connects
                                movement with the user's journey.
                            </p>
                        </div>

                        <span className="motion-experiment__arrow">
                            ↗
                        </span>
                    </article>

                    <article className="motion-experiment">
                        <span className="motion-experiment__number">
                            03
                        </span>

                        <div className="motion-experiment__info">
                            <h3>LENIS</h3>

                            <p>
                                Smooth scrolling and controlled interaction
                                between the user and the page.
                            </p>
                        </div>

                        <span className="motion-experiment__arrow">
                            ↗
                        </span>
                    </article>

                    <article className="motion-experiment">
                        <span className="motion-experiment__number">
                            04
                        </span>

                        <div className="motion-experiment__info">
                            <h3>VIEW TRANSITIONS</h3>

                            <p>
                                Seamless visual transitions between
                                different interface states and pages.
                            </p>
                        </div>

                        <span className="motion-experiment__arrow">
                            ↗
                        </span>
                    </article>
                </div>
            </div>
        </section>
    );
}

export default Experiments;