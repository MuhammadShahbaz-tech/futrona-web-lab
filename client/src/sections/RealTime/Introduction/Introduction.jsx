
import "./Introduction.css";

const Introduction = () => {
    return (
        <section className="realtime-intro" id="realtime-introduction">
            <div className="realtime-intro__top">
                <span>01 / Introduction</span>
                <span>Beyond Request & Response</span>
            </div>

            <div className="realtime-intro__content">
                <p className="realtime-intro__eyebrow">
                    A Connected Web
                </p>

                <h2 className="realtime-intro__title">
                    Not just data.
                    <br />
                    <span>Live interaction.</span>
                </h2>

                <div className="realtime-intro__bottom">
                    <p className="realtime-intro__statement">
                        The web doesn't have to wait for the next request.
                        Real-time technologies let applications exchange
                        information continuously, respond instantly, and
                        keep connected users in sync.
                    </p>

                    <div className="realtime-intro__principles">
                        <article className="realtime-intro__principle">
                            <span className="realtime-intro__number">01</span>
                            <h3>Instant</h3>
                            <p>Updates arrive as events happen, without manual refreshes.</p>
                        </article>

                        <article className="realtime-intro__principle">
                            <span className="realtime-intro__number">02</span>
                            <h3>Connected</h3>
                            <p>Clients and servers exchange information over persistent connections.</p>
                        </article>

                        <article className="realtime-intro__principle">
                            <span className="realtime-intro__number">03</span>
                            <h3>Responsive</h3>
                            <p>Interfaces react to live changes and user activity.</p>
                        </article>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Introduction;
