import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const webGLIntroductionAnimation = () => {
  const section = document.querySelector(".webgl-introduction");

  if (!section) return;

  const header = section.querySelector(".webgl-introduction__header");
  const title = section.querySelector(".webgl-introduction__content h2");
  const paragraphs = section.querySelectorAll(".webgl-introduction__text p");

  gsap.set([header, title, paragraphs], {
    opacity: 1,
    y: 0,
  });

  const animation = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 75%",
      end: "top 25%",
      toggleActions: "play none none reverse",
    },
  });

  animation
    .from(header, {
      y: 25,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
    })
    .from(
      title,
      {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.35"
    )
    .from(
      paragraphs,
      {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      },
      "-=0.5"
    );

  return () => {
    animation.scrollTrigger?.kill();
    animation.kill();
  };
};

export default webGLIntroductionAnimation;