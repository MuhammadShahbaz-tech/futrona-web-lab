import { useEffect } from "react";
import heroAnimation from "../../../animations/home/heroAnimation";

function hero(){
    useEffect(() => {
        const cleanup = heroAnimation();

        return cleanup;
    }, []);
    return (
        <section className="home-hero section">
            <div className="container">
                <div className="home-hero__content">
                    <p className="home-hero__eyebrow">Future Web Lab/ 001</p>
                    <h1 className="home-hero__title">
                        The Web Is
                        <span>No Longer a Page.</span>
                        <span>Its An Experience.</span>
                    </h1>

                    <div className="home-hero__bottom">
                        <p className="home-hero__description">
                            An Experimental laboratory exploring the technologies shaping the next generation of the web.
                        </p>

                        <div className="home-hero__meta">
                            <span>Explore the lab</span>
                            <span>↓</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default hero;