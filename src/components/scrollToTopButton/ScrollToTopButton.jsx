import { useEffect, useState } from "react";
import { useScrollContext } from "../ScrollContext";
import styles from "./scrollToTopButton.module.scss";

export function ScrollToTopButton() {
  const { lenis } = useScrollContext();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lenis) return undefined;

    const handleScroll = ({ scroll = 0 }) => {
      setVisible(scroll > window.innerHeight * 0.75);
    };

    lenis.on("scroll", handleScroll);
    handleScroll({ scroll: window.scrollY || 0 });

    return () => lenis.off("scroll", handleScroll);
  }, [lenis]);

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.3 });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className={`${styles.button} ${visible ? styles.visible : ""}`}
      onClick={scrollToTop}
      aria-label="Back to the top"
      tabIndex={visible ? 0 : -1}
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        className={styles.icon}
      >
        <path
          d="M10 16V4M10 4l-5 5M10 4l5 5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={styles.label}>Top</span>
    </button>
  );
}
