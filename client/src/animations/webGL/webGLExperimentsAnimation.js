import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const webGLExperimentsAnimation = () => {
  const section = document.querySelector(".webgl-experiments");

  if (!section) return;

  const header = section.querySelector(".webgl-experiments__header");
  const label = section.querySelector(".webgl-experiments__label");
  const title = section.querySelector(".webgl-experiments__intro h2");
  const description = section.querySelector(
    ".webgl-experiments__description"
  );
  const panel = section.querySelector(".webgl-experiments__panel");

  gsap.set([header, label, title, description, panel], {
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
      label,
      {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.35"
    )
    .from(
      title,
      {
        y: 70,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.3"
    )
    .from(
      description,
      {
        y: 25,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.5"
    )
    .from(
      panel,
      {
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.8"
    );

  return () => {
    animation.scrollTrigger?.kill();
    animation.kill();
  };
};

export default webGLExperimentsAnimation;