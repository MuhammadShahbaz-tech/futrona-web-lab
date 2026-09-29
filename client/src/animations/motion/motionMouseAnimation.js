import gsap from "gsap";

function motionMouseAnimation() {
    const experiments = document.querySelectorAll(
        ".motion-experiment"
    );

    if (!experiments.length) return;

    const context = gsap.context(() => {
        experiments.forEach((experiment) => {
            const title = experiment.querySelector(
                ".motion-experiment__info h3"
            );

            const arrow = experiment.querySelector(
                ".motion-experiment__arrow"
            );

            experiment.addEventListener("mousemove", (event) => {
                const rect = experiment.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const moveX = (x / rect.width - 0.5) * 12;
                const moveY = (y / rect.height - 0.5) * 8;

                gsap.to(title, {
                    x: moveX,
                    y: moveY,
                    duration: 0.3,
                    ease: "power3.out",
                });

                gsap.to(arrow, {
                    x: moveX * 0.6,
                    y: moveY * 0.6,
                    duration: 0.3,
                    ease: "power3.out",
                });
            });

            experiment.addEventListener("mouseleave", () => {
                gsap.to(title, {
                    x: 0,
                    y: 0,
                    duration: 0.4,
                    ease: "power3.out",
                });

                gsap.to(arrow, {
                    x: 0,
                    y: 0,
                    duration: 0.4,
                    ease: "power3.out",
                });
            });
        });
    });

    return () => context.revert();
}

export default motionMouseAnimation;