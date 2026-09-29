import gsap from "gsap";

function motionTiltAnimation() {
    const experiments = document.querySelectorAll(
        ".motion-experiment"
    );

    if (!experiments.length) return;

    const context = gsap.context(() => {
        experiments.forEach((experiment) => {
            experiment.addEventListener("mousemove", (event) => {
                const rect = experiment.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const rotateY =
                    (x / rect.width - 0.5) * 6;

                const rotateX =
                    (y / rect.height - 0.5) * -4;

                gsap.to(experiment, {
                    rotateX,
                    rotateY,
                    transformPerspective: 800,
                    duration: 0.3,
                    ease: "power3.out",
                });
            });

            experiment.addEventListener("mouseleave", () => {
                gsap.to(experiment, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.5,
                    ease: "power3.out",
                });
            });
        });
    });

    return () => context.revert();
}

export default motionTiltAnimation;