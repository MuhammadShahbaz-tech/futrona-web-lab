import gsap from "gsap";

function magneticArrowAnimation() {
    const experiments = document.querySelectorAll(
        ".motion-experiment"
    );

    if (!experiments.length) return;

    const context = gsap.context(() => {
        experiments.forEach((experiment) => {
            const arrow = experiment.querySelector(
                ".motion-experiment__arrow"
            );

            if (!arrow) return;

            experiment.addEventListener("mousemove", (event) => {
                const rect = experiment.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const arrowRect = arrow.getBoundingClientRect();

                const arrowX =
                    arrowRect.left -
                    rect.left +
                    arrowRect.width / 2;

                const arrowY =
                    arrowRect.top -
                    rect.top +
                    arrowRect.height / 2;

                const distanceX = x - arrowX;
                const distanceY = y - arrowY;

                const strength = 0.12;

                gsap.to(arrow, {
                    x: distanceX * strength,
                    y: distanceY * strength,
                    duration: 0.3,
                    ease: "power3.out",
                });
            });

            experiment.addEventListener("mouseleave", () => {
                gsap.to(arrow, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.4)",
                });
            });
        });
    });

    return () => context.revert();
}

export default magneticArrowAnimation;