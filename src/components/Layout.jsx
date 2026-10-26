import { useLayoutEffect, useState } from "react";
import PropTypes from "prop-types";
import gsap from "gsap";
import { Loader } from "../pages";
import { MathCursor } from "./MathCursor";
import { StickyCursor } from "./StickyCursor";
import { NavBar } from "./NavBar";
import { ScrollToTopButton } from "./scrollToTopButton/ScrollToTopButton";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import styles from "./Layout.module.scss";

export function Layout({ children }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [loaderFinished, setLoaderFinished] = useState(prefersReducedMotion);
  const [timeline, setTimeline] = useState(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      setLoaderFinished(true);
      return undefined;
    }

    const context = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setLoaderFinished(true),
      });

      setTimeline(tl);
    });

    return () => context.revert();
  }, [prefersReducedMotion]);

  const skipIntro = () => {
    timeline?.kill();
    setLoaderFinished(true);
  };

  return (
    <>
      {loaderFinished ? (
        <>
          <NavBar />
          {children}
          <Footer />
          <ScrollToTopButton />
          <StickyCursor />
          <MathCursor />
        </>
      ) : (
        <Loader timeline={timeline} onSkip={skipIntro} />
      )}
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerGlow} aria-hidden="true" />
      <div className={styles.footerInner}>
        <div className={styles.seal} aria-hidden="true">
          <span>Q.E.D.</span>
        </div>
        <p className={styles.footerTitle}>Happy Birthday, Lathika Aunty.</p>
        <p className={styles.footerCopy}>
          For every lesson, every kindness, and every student you made feel
          seen.
        </p>
        <div className={styles.footerRule} aria-hidden="true">
          <span />
          <i>∞</i>
          <span />
        </div>
        <div className={styles.footerMeta}>
          <span>Grade 10 · Mathematics</span>
          <span className={styles.footerDot} aria-hidden="true" />
          <span>Made with love by your students</span>
        </div>
      </div>
    </footer>
  );
}
