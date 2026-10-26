import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollContext } from "./ScrollContext";
import styles from "./Scroll.module.scss";

gsap.registerPlugin(ScrollTrigger);

/**
 * Keeps the original smooth-scroll architecture: an inner scroll wrapper is
 * driven by Lenis and linked to GSAP's ScrollTrigger.
 */
export function Scroll({ children }) {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;

    if (!wrapper || !content) return undefined;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const instance = new Lenis({
      wrapper,
      content,
      duration: prefersReducedMotion ? 0.8 : 1.15,
      smoothWheel: !prefersReducedMotion,
      smoothTouch: false,
      touchMultiplier: 1.4,
      wheelMultiplier: 1,
      infinite: false,
    });

    const onScroll = () => ScrollTrigger.update();
    instance.on("scroll", onScroll);

    const tick = (time) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.defaults({ scroller: wrapper });
    ScrollTrigger.refresh();
    setLenis(instance);

    return () => {
      instance.off("scroll", onScroll);
      instance.destroy();
      gsap.ticker.remove(tick);
      setLenis(null);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div ref={contentRef} className={styles.content}>
        <ScrollContext.Provider value={{ lenis, wrapperRef, contentRef }}>
          {children}
        </ScrollContext.Provider>
      </div>
    </div>
  );
}

Scroll.propTypes = {
  children: PropTypes.node.isRequired,
};
