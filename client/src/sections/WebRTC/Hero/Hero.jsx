
import "./Hero.css";

const Hero = () => {
    return (
        <section className="webrtc-hero" id="webrtc-hero">
            <div className="webrtc-hero__top">
                <span>07 / REAL-TIME COMMUNICATION</span>
                <span>WEBRTC / PEER-TO-PEER</span>
            </div>

            <div className="webrtc-hero__content">
                <p className="webrtc-hero__eyebrow">
                    Beyond the server
                    <span className="webrtc-hero__signal" />
                    Direct connection
                </p>

                <h1>
                    Closer.
                    <br />
                    <span>Without distance.</span>
                </h1>

                <p className="webrtc-hero__description">
                    Real-time communication between browsers.
                    Audio, video, and data moving directly between peers.
                </p>

                <a className="webrtc-hero__link" href="#webrtc-introduction">
                    EXPLORE THE CONNECTION
                    <span aria-hidden="true">↘</span>
                </a>
            </div>

            <div className="webrtc-hero__visual" aria-hidden="true">
                <div className="webrtc-hero__orbit webrtc-hero__orbit--outer" />
                <div className="webrtc-hero__orbit webrtc-hero__orbit--inner" />

                <div className="webrtc-hero__node webrtc-hero__node--left">
                    <span />
                    <small>PEER 01</small>
                </div>

                <div className="webrtc-hero__node webrtc-hero__node--right">
                    <span />
                    <small>PEER 02</small>
                </div>

                <div className="webrtc-hero__connection">
                    <span className="webrtc-hero__connection-line" />
                    <span className="webrtc-hero__connection-pulse" />
                </div>

                <span className="webrtc-hero__visual-label">
                    DIRECT / ENCRYPTED / CONNECTED
                </span>
            </div>

            <div className="webrtc-hero__bottom">
                <span>NO CENTRAL MEDIA ROUTING REQUIRED</span>
                <span>BUILT FOR THE OPEN WEB ↘</span>
            </div>
        </section>
    );
};

export default Hero;
                                   