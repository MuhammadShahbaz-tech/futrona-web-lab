import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function threeDAnimation() {
    const page = document.querySelector(".threed-page");

    if(!page) return;

    const context = gsap.context(() =>  {
        const hero = page.querySelector(".threed-hero");

        if(!hero) {
            const header = hero.querySelector(
                ".threed-hero__header"
            );

            const title = hero.querySelector(
                ".threed-hero__title"
            );

            const description = hero.querySelector(
                ".threed-hero__description"
            );

            const timeline = gsap.timeline();

            if(header) {
                timeline.from(header,{
                    y: 30,
                    opacity:0,
                    duration: 0.8,
                    ease:"power3.out",
                });
            }

            if(title) {
                timeline.from(
                    title.querySelectorAll("span"),
                    {
                        y: 80,
                        opacity: 0,
                        duration: 1,
                        stagger: 0.12,
                        ease: "power4.out"
                    },
                    "-=0.4"
                );
            }

            if (description) {
                timeline.from(
                    description,
                    {
                        y: 30,
                        opacity: 0,
                        duration: 0.8,
                        ease: "power3.out",
                    },
                    "-=0.5"
                );
            }
        }
        const introduction = page.querySelector(
            ".threed-introduction"
        );

        if (introduction) {
            const header = introduction.querySelector(
                ".threed-introduction__header"
            );

            const title = introduction.querySelector(
                ".threed-introduction__title"
            );

            const description = introduction.querySelector(
                ".threed-introduction__description"
            );

            const elements = [
                header,
                title,
                description,
            ].filter(Boolean);

            gsap.from(elements, {
                y: 50,
                opacity: 0,
                duration: 0.9,
                stagger: 0.12,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: introduction,
                    start: "top 75%",
                    once: true,
                },
            });
        }

        const experiments = page.querySelector(
            ".threed-experiments"
        );

        if (experiments) {
            const header = experiments.querySelector(
                ".threed-experiments__header"
            );

            const items = experiments.querySelectorAll(
                ".threed-experiment"
            );

            gsap.from(
                [header, ...items].filter(Boolean),
                {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: experiments,
                        start: "top 75%",
                        once: true,
                    },
                }
            );
        }
    }, page);

    return () => context.revert();
}

export default threeDAnimation;