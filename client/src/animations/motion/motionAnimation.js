import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function motionAnimation() {
    const section = document.querySelector(".motion-hero");
    const introduction = document.querySelector(".motion-introduction");
    const experiments = document.querySelector(".motion-experiments");

    if (!section) return;

    const context = gsap.context(() => {

        // Hero

        const header = section.querySelector(".motion-hero__header");
        const eyebrow = section.querySelector(".motion-hero__eyebrow");
        const title = section.querySelector(".motion-hero__title");
        const titleSpans = section.querySelectorAll(
            ".motion-hero__title span"
        );
        const description = section.querySelector(
            ".motion-hero__description"
        );

        gsap.set([header, eyebrow, title, description], {
            opacity: 0,
            y: 40,
        });

        gsap.set(titleSpans, {
            opacity: 0,
            y: 80,
        });

        const heroTimeline = gsap.timeline({
            defaults: {
                ease: "power3.out",
            },
        });

        heroTimeline
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

        // Introduction

        if (introduction) {
            const introductionHeader = introduction.querySelector(
                ".motion-introduction__header"
            );

            const introductionTitle = introduction.querySelector(
                ".motion-introduction__title"
            );

            const introductionDescription = introduction.querySelector(
                ".motion-introduction__description"
            );

            const introductionTitleSpans =
                introduction.querySelectorAll(
                    ".motion-introduction__title span"
                );

            gsap.set(
                [
                    introductionHeader,
                    introductionTitle,
                    introductionDescription,
                ],
                {
                    opacity: 0,
                    y: 50,
                }
            );

            gsap.set(introductionTitleSpans, {
                opacity: 0,
                y: 60,
            });

            gsap.timeline({
                scrollTrigger: {
                    trigger: introduction,
                    start: "top 75%",
                    once: true,
                },
                defaults: {
                    ease: "power3.out",
                },
            })
                .to(introductionHeader, {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                })
                .to(
                    introductionTitle,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                    },
                    "-=0.35"
                )
                .to(
                    introductionTitleSpans,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        stagger: 0.12,
                    },
                    "-=0.4"
                )
                .to(
                    introductionDescription,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                    },
                    "-=0.5"
                );
        }

        // Experiments

        if (experiments) {
            const experimentsHeader = experiments.querySelector(
                ".motion-experiments__header"
            );

            const experimentsItems = experiments.querySelectorAll(
    ".motion-experiment"
);

            gsap.set(experimentsHeader, {
                opacity: 0,
                y: 50,
            });

            gsap.set(experimentsItems, {
                opacity: 0,
                y: 60,
            });

            gsap.timeline({
                scrollTrigger: {
                    trigger: experiments,
                    start: "top 75%",
                    once: true,
                },
                defaults: {
                    ease: "power3.out",
                },
            })

                .to(experimentsHeader, {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                })
                .to(experimentsItems, {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    stagger: 0.12,
                },
                    "-=0.3"
                );
        }
    });

    return () => context.revert();
}

export default motionAnimation;