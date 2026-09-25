import gsap from "gsap";

function motionAnimation() {
    const section = document.querySelector(".motion-hero");

    if (!section) return;

    const header = section.querySelector(".motion-hero__header");
    const eyebrow = section.querySelector(".motion-hero__eyebrow");
    const title = section.querySelector(".motion-hero__title");
    const titleSpans = section.querySelectorAll(".motion-hero__title span");
    const description = section.querySelector(".motion-hero__description");

    const context = gsap.context(() => {
        gsap.set([header, eyebrow, title, description], {
            opacity: 0,
            y: 40,
        });

        gsap.set(titleSpans, {
            opacity: 0,
            y: 80,
        });

        const timeline = gsap.timeline({
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
                eyebrow,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                },
                "-=0.35"
            )
            .to(
                title,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                },
                "-=0.35"
            )
            .to(
                titleSpans,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    stagger: 0.12,
                },
                "-=0.35"
            )
            .to(
                description,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                },
                "-=0.5"
            );
    }, section);

    return () => context.revert();
}

export default motionAnimation;