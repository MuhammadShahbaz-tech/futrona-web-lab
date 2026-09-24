import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function introductionAnimation() {
    const section = document.querySelector(".home-introduction");

    if (!section) return;

    const header = section.querySelector(".home-introduction__header");
    const title = section.querySelector(".home-introduction__title");
    const titleSpans = section.querySelectorAll(
        ".home-introduction__title span"
    );
    const description = section.querySelector(
        ".home-introduction__description"
    );

    const context = gsap.context(() => {
        gsap.set(header, {
            opacity: 0,
            y: 30,
        });

        gsap.set(title, {
            opacity: 0,
            y: 50,
        });

        gsap.set(titleSpans, {
            opacity: 0,
            y: 70,
        });

        gsap.set(description, {
            opacity: 0,
            y: 40,
        });
        const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse",
        },
        defaults: {
            ease: "power3.out"
        },
    });

    timeline
        .to(header, {
            opacity: 1,
            y: 0,
            duration: 0.7,
        })
        .to(title, {
            opacity: 1,
            y: 0,
            duration: 0.7
        },
        "-=0.35"
    )
    .to(
        titleSpans, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
        },
        "-=0.4"
    )
    .to(
        description, {
            opacity: 1,
            y: 0,
            duration: 0.8,
        },
        "-=0.5"
    );
}, section);

    

return () => context.revert();

}

export default introductionAnimation;