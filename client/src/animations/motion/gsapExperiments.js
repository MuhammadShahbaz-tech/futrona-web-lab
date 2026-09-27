import gsap from "gsap";

function gsapExperiments() {
    const experiments = document.querySelectorAll(
        ".motion-experiment"
    );

    if(!experiments.length) return;

    const context = gsap.context(()=> {
        experiments.forEach((experiment) =>{
            const arrow = experiment.querySelector(
                ".motion-experiment__arrow"
            );

            const title = experiment.querySelector(
                ".motion-experiment__info h3"
            );

            const paragraph = experiment.querySelector(
                ".motion-experiment__info p"
            );

            const line = experiment.querySelectorAll(
                ".motion-experiment__line"
            );

            experiment.addEventListener("mouseenter", () => {
                gsap.to(title,{
                    x: 12,
                    duration: 0.4,
                    ease: "power3.out",
                });

                gsap.to(arrow,  {
                    x: 8,
                    y: -8,
                    duration: 0.4,
                    ease: "power3.out",
                });

                gsap.to(paragraph, {
                    x: 8,
                    opacity: 1,
                    duration: 0.4,
                    ease: "power3.out",
                });

                gsap.to(line, {
                    width: "100%",
                    duration: 0.4,
                    ease: "power3.out",
                });
            });

            experiment.addEventListener("mouseleave", () => {
                gsap.to(title, {
                    x: 0,
                    duration: 0.4,
                    ease: "power3.out",
                });

                gsap.to(arrow, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: "power3.out",
                });

                gsap.to(paragraph, {
                    x: 0,
                    opacity: 0.7,
                    duration: 0.4,
                    ease: "power3.out",
                });

                gsap.to(line, {
                    width: "0%",
                    duration: 0.6,
                    ease: "power3.out",
                });
            });
        });
    });

    return () => context.revert();
}

export default gsapExperiments;