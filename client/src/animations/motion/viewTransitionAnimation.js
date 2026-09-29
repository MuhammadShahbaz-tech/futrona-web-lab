function viewTransitionAnimation() {
    const experiments = document.querySelectorAll(
        ".motion-experiment"
    );

    if (!experiments.length) return;

    const context = {
        cleanups: [],
    };

    experiments.forEach((experiment) => {
        const title = experiment.querySelector(
            ".motion-experiment__info h3"
        );

        if (!title) return;

        const handleClick = () => {
            if (!document.startViewTransition) {
                title.classList.toggle(
                    "motion-experiment__title-active"
                );

                return;
            }

            document.startViewTransition(() => {
                title.classList.toggle(
                    "motion-experiment__title-active"
                );
            });
        };

        experiment.addEventListener("click", handleClick);

        context.cleanups.push(() => {
            experiment.removeEventListener(
                "click",
                handleClick
            );
        });
    });

    return () => {
        context.cleanups.forEach((cleanup) => cleanup());
    };
}

export default viewTransitionAnimation;