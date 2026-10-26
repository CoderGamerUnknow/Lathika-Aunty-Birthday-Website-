import { useRef } from "react";
import { motion } from "framer-motion";
import styles from "./cursor.module.scss";

const STICKY_GAP = 6;
const MAX_VELOCITY = 1.45;

/**
 * Static-facing pointer cursor with path smoothing, bounce on reveal,
 * and gentle trailing dots. No pointer-events on the canvas layer so it
 * never steals clicks, scrolls smoothly, and avoids jitter on fast
 * pointer movement.
 */
export function StickyCursor() {
  const previousRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const pointersRef = useRef(new Map());
  const springsRef = useRef(new Map());
  const frameRef = useRef(0);

  const renderPointer = (id, client, motion) => {
    const cursor = document.getElementById(`sticky-cursor-${id}`);
    const ring = document.getElementById(`sticky-ring-${id}`);
    const trail = document.getElementById(`sticky-trail-${id}`);

    if (!cursor) return;

    cursor.setAttribute("data-left", String(motion.x));
    cursor.setAttribute("data-top", String(motion.y));

    if (trail) {
      const latency = Math.hypot(
        motion.x - client.x,
        motion.y - client.y
      );
      const alpha = clamp(0.55 - latency / 360, 0, 0.55);
      trail.setAttribute("stroke", `rgba(247, 220, 164, ${alpha})`);
      trail.setAttribute(
        "d",
        `M 0 0 L ${motion.x - client.x} ${motion.y - client.y}`
      );
    }

    if (ring) {
      ring.setAttribute(
        "d",
        `M 0 0 L ${motion.x - client.x} ${motion.y - client.y}`
      );
    }

    if (document.documentElement.classList.contains("has-custom-cursor")) {
      document.documentElement.style.setProperty("--cursor-x", `${motion.x}px`);
      document.documentElement.style.setProperty("--cursor-y", `${motion.y}px`);
    }
  };

  const renderCursor = (id, cursorId) => {
    const motion = springTo(id, { x: 0, y: 0 }, false);
    const cursor = document.getElementById(cursorId);

    if (!cursor) return;

    cursor.style.left = `${motion.x}px`;
    cursor.style.top = `${motion.y}px`;

    if (document.documentElement.classList.contains("has-custom-cursor")) {
      document.documentElement.style.setProperty("--cursor-x", `${motion.x}px`);
      document.documentElement.style.setProperty("--cursor-y", `${motion.y}px`);
    }
  };

  const renderFrame = () => {
    const now = performance.now();
    frameRef.current = now;

    pointersRef.current.forEach((pointer, id) => {
      updateVelocity(pointer);
      renderPointer(id, pointer, springTo(id, pointer, true));
    });

    for (const [id, cursorId] of Object.entries(idToCursor)) {
      if (!pointersRef.current.has(id) && springsRef.current.has(id)) {
        const spring = springsRef.current.get(id);
        if (spring.bounce < 0.12) {
          spring.bounce = 0;
          springsRef.current.set(id, spring);
          removePointer(id);
          continue;
        }
        spring.bounce *= 0.82;
        springsRef.current.set(id, spring);
      }
      if (springsRef.current.has(id)) {
        renderCursor(id, cursorId);
      }
    }

    frameRef.current = requestAnimationFrame(renderFrame);
  };

  const idToCursor = {
    pointerA: "sticky-cursor-A",
    pointerB: "sticky-cursor-B",
    sticky: "sticky-cursor-main",
  };

  const springTo = (id, target, isPointer) => {
    const spring = springsRef.current.get(id) || {
      current: target,
      previous: target,
      velocity: { x: 0, y: 0 },
      stiffness: isPointer ? 280 : 70,
      damping: isPointer ? 10 : 14,
      mass: isPointer ? 0.24 : 0.62,
      bounce: isPointer ? 0 : 0.16,
    };

    const predicted = predictPosition(target, spring.velocity);

    const error = {
      x: predicted.x - spring.current.x,
      y: predicted.y - spring.current.y,
    };

    const speed = Math.hypot(spring.velocity.x, spring.velocity.y);
    const normalized = isPointer
      ? smoothStep(speed / 6, 0, 1)
      : smoothStep(speed / 56, 0, 1);
    const bounce = spring.bounce * (1 - normalized) + 0.08 * normalized;
    spring.bounce = clamp(bounce, 0, 0.6);

    spring.current = {
      x: spring.current.x + error.x * spring.stiffness * 0.08,
      y: spring.current.y + error.y * spring.stiffness * 0.08,
    };

    spring.velocity = {
      x: lerp(spring.velocity.x, error.x, spring.stiffness * 0.035),
      y: lerp(spring.velocity.y, error.y, spring.stiffness * 0.035),
    };

    const smoothed = {
      x: spring.current.x + spring.velocity.x * 0.03,
      y: spring.current.y + spring.velocity.y * 0.03,
    };

    if (isPointer) {
      spring.current = {
        x: lerp(spring.current.x, predicted.x, 0.55),
        y: lerp(spring.current.y, predicted.y, 0.55),
      };
      spring.velocity = {
        x: lerp(spring.velocity.x, error.x * 0.03, 0.12),
        y: lerp(spring.velocity.y, error.y * 0.03, 0.12),
      };
    }

    spring.current = {
      x: spring.current.x + (smoothed.x - spring.current.x) * 0.18,
      y: spring.current.y + (smoothed.y - spring.current.y) * 0.18,
    };

    springsRef.current.set(id, spring);
    return targetToMotion(spring.current, target);
  };

  const updateVelocity = (pointer) => {
    const previous = previousRef.current;
    const velocity = velocityRef.current;
    const dx = pointer.x - previous.x;
    const dy = pointer.y - previous.y;
    previousRef.current = pointer;

    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      velocity.x = lerp(velocity.x, dx, 0.12);
      velocity.y = lerp(velocity.y, dy, 0.12);
    } else {
      velocity.x = lerp(velocity.x, 0, 0.34);
      velocity.y = lerp(velocity.y, 0, 0.34);
    }

    if (!Math.abs(velocity.x) < 0.04 && !Math.abs(velocity.y) < 0.04) {
      velocity.x = clamp(velocity.x, -MAX_VELOCITY, MAX_VELOCITY);
      velocity.y = clamp(velocity.y, -MAX_VELOCITY, MAX_VELOCITY);
    } else {
      velocity.x = 0;
      velocity.y = 0;
    }
  };

  const removePointer = (id) => {
    pointersRef.current.delete(id);
    springsRef.current.delete(id);
  };

  const predictPosition = (target, velocity) => ({
    x: target.x + velocity.x * 0.0085 - STICKY_GAP,
    y: target.y + velocity.y * 0.0085 - STICKY_GAP,
  });

  const targetToMotion = (spring, target) => ({
    x: spring.current.x - target.x,
    y: spring.current.y - target.y,
  });

  const smoothStep = (value, min, max) => {
    const t = clamp((value - min) / (max - min), 0, 1);
    return t * t * (3 - 2 * t);
  };

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

  const lerp = (start, end, amount) => start + (end - start) * amount;

  if (typeof window === "undefined") {
    return null;
  }

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !document.body
  ) {
    return null;
  }

  frameRef.current = requestAnimationFrame(renderFrame);

  return (
    <>
      <motion.div
        id="sticky-cursor-A"
        className={styles.stickyCursor}
        style={{
          willChange: "transform",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 999,
        }}
      >
        <motion.div
          className={styles.stickyDot}
          style={{
            willChange: "transform",
            filter: "drop-shadow(0 0 10px rgba(247, 220, 164, 0.85))",
          }}
        />
      </motion.div>

      <motion.div
        id="sticky-cursor-B"
        className={styles.stickyCursor}
        style={{
          willChange: "transform",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 998,
        }}
      >
        <motion.div
          className={styles.stickyDot}
          style={{
            willChange: "transform",
            filter: "drop-shadow(0 0 8px rgba(247, 220, 164, 0.55))",
          }}
        />
      </motion.div>

      <motion.div
        id="sticky-cursor-main"
        className={styles.stickyCursor}
        style={{
          willChange: "transform",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 997,
        }}
      >
        <motion.div
          className={styles.stickyDot}
          style={{
            willChange: "transform",
            filter: "drop-shadow(0 0 6px rgba(247, 220, 164, 0.45))",
          }}
        />
      </motion.div>

      <svg className={styles.stickyLayers} width="0" height="0" aria-hidden="true">
        <line
          id="sticky-ring-A"
          className={styles.stickyRing}
          stroke="rgba(247, 220, 164, 0.28)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <line
          id="sticky-ring-B"
          className={styles.stickyRing}
          stroke="rgba(247, 220, 164, 0.16)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <polyline
          id="sticky-trail-A"
          className={styles.stickyTrail}
          fill="none"
          stroke="rgba(247, 220, 164, 0.28)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <style>{`
        .stickyCursor {
          position: fixed;
          pointer-events: none;
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0.85);
          opacity: 0;
          transition: opacity 200ms ease-out, transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }

        .stickyDot {
          position: absolute;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: radial-gradient(circle at 32% 28%, #f7dca4, #e8bd78);
          box-shadow: 0 0 18px rgba(232, 189, 120, 0.9), 0 0 44px rgba(247, 220, 164, 0.55);
          transform: translate(-50%, -50%) scale(0.75);
          will-change: transform;
        }

        .stickyRing {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          transform: translate(-50%, -50%);
          stroke: rgba(247, 220, 164, 0.18);
          stroke-width: 1.6;
          pointer-events: none;
          opacity: 0;
        }

        .stickyTrail {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 200ms ease;
        }

        .stickyCursor.visible {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      `}</style>
    </>
  );
}
