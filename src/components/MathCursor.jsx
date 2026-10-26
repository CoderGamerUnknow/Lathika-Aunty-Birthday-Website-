import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { createPortal } from "react-dom";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import styles from "./MathCursor.module.scss";

export function MathCursor() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);
  const x = useSpring(
    pointerX,
    prefersReducedMotion
      ? { stiffness: 2400, damping: 110, mass: 0.05 }
      : { stiffness: 520, damping: 42, mass: 0.32 }
  );
  const y = useSpring(
    pointerY,
    prefersReducedMotion
      ? { stiffness: 2400, damping: 110, mass: 0.05 }
      : { stiffness: 520, damping: 42, mass: 0.32 }
  );
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const hoveringRef = useRef(false);

  useEffect(() => {
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    if (!finePointer) return undefined;

    document.documentElement.classList.add("has-custom-cursor");
    setEnabled(true);

    const handlePointerMove = (event) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
    };

    const handlePointerOver = (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const isInteractive = Boolean(
        target?.closest("a, button, [role='tab'], [data-cursor]")
      );

      if (isInteractive !== hoveringRef.current) {
        hoveringRef.current = isInteractive;
        setHovering(isInteractive);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    document.addEventListener("pointerover", handlePointerOver, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [pointerX, pointerY]);

  if (!enabled) return null;

  return createPortal(
    <motion.div
      className={`${styles.cursor} ${hovering ? styles.hovering : ""}`}
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{
        opacity: 1,
        scale: hovering && !prefersReducedMotion ? 1.65 : 1,
      }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 330, damping: 26 }
      }
      aria-hidden="true"
    >
      <span className={styles.dot} />
      <span className={styles.tickTop} />
      <span className={styles.tickBottom} />
    </motion.div>,
    document.body
  );
}
