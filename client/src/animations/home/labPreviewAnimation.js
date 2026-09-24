import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function labPreviewAnimation() {
    const section = document.querySelector(".home-lab-preview");

    if (!section) return;

    const header = section.querySelector(".home-lab-preview__header");
    const items = section.querySelectorAll(".home-lab-preview__item");

    const context = gsap.context(() => {
        gsap.set(header, {
            opacity: 0,
            y: 30,
        });

        gsap.set(items, {
            opacity: 0,
            y: 50,
        });

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 75%",
                toggleActions: "play none none reverse",
            },
            defaults: {
                ease: "power3.out",
            },
        });

        timeline
            .to(header, {
                opacity: 1,
                y: 0,
                duration: 0.7,
            })
            .to(
                items,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                },
                "-=0.35"
            );
    }, section);

    return () => context.revert();
}

export default labPreviewAnimation;