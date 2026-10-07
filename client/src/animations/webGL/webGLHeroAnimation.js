import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const webGLHeroAnimation = () => {
  const hero = document.querySelector(".webgl-hero");

  if (!hero) return;

  const eyebrow = hero.querySelector(".webgl-hero__eyebrow");
  const meta = hero.querySelector(".webgl-hero__meta");
  const title = hero.querySelectorAll(".webgl-hero__title span");
  const description = hero.querySelector(".webgl-hero__description");

  // Make sure the content is visible before starting the animation.
  gsap.set([eyebrow, meta, title, description], {
    opacity: 1,
    y: 0,
  });

  const intro = gsap.timeline({
    defaults: {
      ease: "power3.out",
    },
  });

  intro
    .from(eyebrow, {
      y: 20,
      opacity: 0,
      duration: 0.8,
    })
    .from(
      meta,
      {
        y: 20,
        opacity: 0,
        duration: 0.8,
      },
      "-=0.5"
    )
    .from(
      title,
      {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
      },
      "-=0.4"
    )
    .from(
      description,
      {
        y: 20,
        opacity: 0,
        duration: 0.8,
      },
      "-=0.5"
    );

  const scrollAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
  });

  scrollAnimation
    .to(
      title,
      {
        y: -40,
        stagger: 0.04,
      },
      0
    )
    .to(
      description,
      {
        y: -30,
      },
      0
    )
    .to(
      meta,
      {
        y: -20,
      },
      0
    );

  return () => {
    intro.kill();
    scrollAnimation.scrollTrigger?.kill();
    scrollAnimation.kill();
  };
};

export default webGLHeroAnimation;