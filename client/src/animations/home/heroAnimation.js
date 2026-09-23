import gsap from "gsap";

function heroAnimation() {
    const section = document.querySelector(".home-hero");

    if (!section) return;

    const eyebrow = section.querySelector(".home-hero__eyebrow");
    const title = section.querySelector(".home-hero__title");
    const titleSpans = section.querySelector(".home-hero__title span");
    const description = section.querySelector(".home-hero__description");
    const meta = section.querySelector(".home-hero__meta");

    const context = gsap.context(() => {
        gsap.set(
            [eyebrow, title, description, meta],
            {
                opacity: 0,
                y: 40,
            }
        );

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
            .to(eyebrow, {
                opacity: 1,
                y: 0,
                duration: 0.8,
            })

            .to(
                title, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                },
                "-=0.4",
            )
            .to(
                titleSpans,
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.12,
                },
                "-=0.35"
            )
            .to(
                description,
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8
                },
                "-=0.5"
            )
            .to(
                meta, {
                    opacity: 1,
                    duration: 0,
                    duration: 0.8,
                },
                "-=0.6"
            );
    }, section);

    return () => context.revert();
}


export default heroAnimation;