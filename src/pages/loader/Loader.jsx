import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  animateLoaderOut,
  animateTitleIn,
  progressAnimation,
} from "./animations";
import styles from "./loader.module.scss";

const TICKS = Array.from({ length: 36 }, (_, index) => {
  const angle = (index * 10 * Math.PI) / 180;
  const inner = index % 3 === 0 ? 244 : 252;
  const outer = 260;

  return {
    x1: 360 + Math.cos(angle) * inner,
    y1: 360 + Math.sin(angle) * inner,
    x2: 360 + Math.cos(angle) * outer,
    y2: 360 + Math.sin(angle) * outer,
    strong: index % 3 === 0,
  };
});

const SINE_PATH = (() => {
  const points = [];

  for (let index = 0; index <= 96; index += 1) {
    const x = 44 + (632 * index) / 96;
    const y = 398 - 58 * Math.sin((index / 96) * Math.PI * 4);
    points.push(`${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }

  return points.join(" ");
})();

export function Loader({ timeline, onSkip }) {
  const loaderRef = useRef(null);
  const progressRef = useRef(null);
  const progressNumberRef = useRef(null);

  useEffect(() => {
    if (!timeline) return undefined;

    timeline
      .add(animateTitleIn(loaderRef), 0)
      .add(progressAnimation(progressRef, progressNumberRef), 0)
      .add(animateLoaderOut(loaderRef), ">");

    return undefined;
  }, [timeline]);

  return (
    <div
      className={styles.wrapper}
      ref={loaderRef}
      role="region"
      aria-label="Birthday tribute introduction"
      data-loader-root
    >
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.horizon} aria-hidden="true" />
      <div className={styles.centerGlow} data-loader-glow aria-hidden="true" />

      <div className={styles.orbit} data-loader-orbit aria-hidden="true">
        <svg viewBox="0 0 720 720">
          <defs>
            <radialGradient
              id="loaderOrbitGlow"
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop offset="0%" stopColor="#e8bd78" stopOpacity="0.14" />
              <stop offset="60%" stopColor="#e8bd78" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#e8bd78" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="loaderSine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8ed8ca" stopOpacity="0" />
              <stop offset="28%" stopColor="#8ed8ca" stopOpacity="0.7" />
              <stop offset="72%" stopColor="#e8bd78" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#e8bd78" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="loaderRadius" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e8bd78" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#e8bd78" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          <circle
            cx="360"
            cy="360"
            r="292"
            fill="url(#loaderOrbitGlow)"
          />

          <g className={styles.spinSlow}>
            <circle
              cx="360"
              cy="360"
              r="288"
              fill="none"
              stroke="rgba(232,189,120,0.16)"
              strokeWidth="1"
              strokeDasharray="2 14"
            />
            <circle
              cx="360"
              cy="360"
              r="278"
              fill="none"
              stroke="rgba(142,216,202,0.1)"
              strokeWidth="1"
            />
          </g>

          <g className={styles.spinReverse}>
            <circle
              cx="360"
              cy="360"
              r="214"
              fill="none"
              stroke="rgba(232,189,120,0.11)"
              strokeWidth="1"
              strokeDasharray="1 10"
            />
          </g>

          <g opacity="0.55">
            {TICKS.map((tick, index) => (
              <line
                key={index}
                x1={tick.x1}
                y1={tick.y1}
                x2={tick.x2}
                y2={tick.y2}
                stroke={
                  tick.strong
                    ? "rgba(232,189,120,0.34)"
                    : "rgba(248,243,232,0.1)"
                }
                strokeWidth={tick.strong ? 1.2 : 0.8}
              />
            ))}
          </g>

          <path
            d="M360 70V650M70 360H650"
            fill="none"
            stroke="rgba(248,243,232,0.06)"
            strokeWidth="1"
          />

          <g className={styles.radiusArm}>
            <line
              x1="360"
              y1="360"
              x2="605"
              y2="360"
              stroke="url(#loaderRadius)"
              strokeWidth="1.2"
            />
            <circle
              cx="605"
              cy="360"
              r="4.5"
              fill="#f7dca4"
              opacity="0.9"
            />
            <circle
              cx="605"
              cy="360"
              r="13"
              fill="none"
              stroke="rgba(232,189,120,0.28)"
              strokeWidth="1"
            />
          </g>

          <path
            d="M360 360 L505 228"
            fill="none"
            stroke="rgba(233,166,184,0.45)"
            strokeWidth="1.4"
          />
          <circle cx="360" cy="360" r="3.5" fill="#e8bd78" />
          <text
            x="512"
            y="220"
            fill="rgba(233,166,184,0.76)"
            fontSize="15"
            fontFamily="Fraunces, Georgia, serif"
            fontStyle="italic"
          >
            θ
          </text>

          <circle
            cx="360"
            cy="360"
            r="255"
            fill="none"
            stroke="rgba(232,189,120,0.48)"
            strokeWidth="1.4"
            pathLength="1"
            strokeDasharray="1"
            data-loader-ring
          />

          <path
            d={SINE_PATH}
            fill="none"
            stroke="url(#loaderSine)"
            strokeWidth="1.3"
            pathLength="1"
            strokeDasharray="1"
            data-loader-sweep
          />

          <text
            x="604"
            y="346"
            fill="rgba(248,243,232,0.34)"
            fontSize="12"
            fontFamily="Space Grotesk, sans-serif"
            letterSpacing="1"
          >
            1
          </text>
          <text
            x="94"
            y="392"
            fill="rgba(248,243,232,0.24)"
            fontSize="11"
            fontFamily="Space Grotesk, sans-serif"
            letterSpacing="1"
          >
            −1
          </text>
          <text
            x="402"
            y="654"
            fill="rgba(142,216,202,0.38)"
            fontSize="12"
            fontFamily="Space Grotesk, sans-serif"
            fontStyle="italic"
          >
            sin θ
          </text>
        </svg>
      </div>

      <div className={styles.equationCloud} aria-hidden="true" data-loader-ui>
        <span
          className={`${styles.formula} ${styles.formulaOne}`}
          data-loader-equation
        >
          sin²θ + cos²θ = 1
        </span>
        <span
          className={`${styles.formula} ${styles.formulaTwo}`}
          data-loader-equation
        >
          y = ax² + bx + c
        </span>
        <span
          className={`${styles.formula} ${styles.formulaThree}`}
          data-loader-equation
        >
          (n − 2) × 180°
        </span>
        <span
          className={`${styles.formula} ${styles.formulaFour}`}
          data-loader-equation
        >
          a² + b² = c²
        </span>
      </div>

      <div className={styles.content} data-loader-content data-loader-ui>
        <span className={styles.eyebrow} data-loader-eyebrow>
          A mathematical birthday tribute
        </span>

        <h1 className={styles.title}>
          <span className={styles.titleMask}>
            <span className={styles.word} data-loader-word>
              Happy
            </span>
          </span>
          <span className={styles.titleMask}>
            <span
              className={`${styles.word} ${styles.wordAccent}`}
              data-loader-word
            >
              Birthday
            </span>
          </span>
        </h1>

        <p className={styles.subtitle} data-loader-subtitle>
          for Lathika Aunty
        </p>

        <p className={styles.equationTag} data-loader-equation>
          where every angle, every curve, and every kindness adds up
        </p>
      </div>

      <div className={styles.progressBlock} data-loader-ui>
        <div className={styles.progressTrack}>
          <span className={styles.progressFill} ref={progressRef} />
        </div>
        <div className={styles.progressMeta}>
          <span>Preparing the celebration</span>
          <span className={styles.progressNumber}>
            <span ref={progressNumberRef}>0</span>
            <span>%</span>
          </span>
        </div>
      </div>

      <button
        type="button"
        className={styles.skip}
        onClick={onSkip}
        data-loader-ui
      >
        Skip intro
        <span aria-hidden="true">↗</span>
      </button>

      <div className={styles.flash} data-loader-flash aria-hidden="true" />
    </div>
  );
}

Loader.propTypes = {
  timeline: PropTypes.object,
  onSkip: PropTypes.func.isRequired,
};
