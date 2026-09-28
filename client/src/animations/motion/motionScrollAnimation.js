import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function motionScrollAnimation() {
    const section = document.querySelector(".motion-experiments");

    if (!section) return;

    const items = section.querySelectorAll(
        ".motion-experiment"
    );

    if (!items.length) return;

    const context = gsap.context(() => {
        const list = section.querySelector(
            ".motion-experiments__list"
        );

        if (!list) return;

        gsap.to(list, {
            y: -80,

            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
            },

            ease: "none",
        });
    }, section);

    return () => context.revert();
}

export default motionScrollAnimation;