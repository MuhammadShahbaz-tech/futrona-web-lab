import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function initScrollTrigger() {
    ScrollTrigger.refresh();

    return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
}

export default initScrollTrigger;