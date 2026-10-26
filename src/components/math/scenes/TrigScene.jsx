import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";
import { describeArc, formatDegrees, polar } from "./sceneUtils";
import styles from "./scenes.module.scss";

const CX = 140;
const CY = 166;
const RADIUS = 92;
const WAVE_X = 300;
const WAVE_WIDTH = 226;
const WAVE_BASE = 166;
const WAVE_AMPLITUDE = 53;

const buildWave = (angle, phase = 0) => {
  const points = [];

  for (let index = 0; index <= 108; index += 1) {
    const progress = index / 108;
    const x = WAVE_X + WAVE_WIDTH * progress;
    const waveAngle = angle - progress * Math.PI * 3.2 + phase;
    const y = WAVE_BASE - WAVE_AMPLITUDE * Math.sin(waveAngle);
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  return points.join(" ");
};

export function TrigScene() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const frameRef = useRef(0);
  const [angle, setAngle] = useState(1.1);

  useEffect(() => {
    if (prefersReducedMotion) {
      setAngle(1.1);
      return undefined;
    }

    let previous = performance.now();
    let current = 1.1;

    const animate = (now) => {
      const delta = Math.min(now - previous, 48);
      previous = now;
      current = (current + delta * 0.00052) % (Math.PI * 2);
      setAngle(current);
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameRef.current);
  }, [prefersReducedMotion]);

  const point = polar(CX, CY, RADIUS, angle);
  const sine = Math.sin(angle);
  const cosine = Math.cos(angle);
  const degrees = formatDegrees(angle);
  const arcPath = describeArc(CX, CY, RADIUS, 0, angle);
  const angleLabel = polar(CX, CY, RADIUS * 0.56, angle / 2);
  const sinePoints = buildWave(angle, 0);
  const cosinePoints = buildWave(angle, Math.PI / 2);
  const sineDotY = WAVE_BASE - WAVE_AMPLITUDE * sine;
  const cosineDotY = WAVE_BASE - WAVE_AMPLITUDE * cosine;

  return (
    <svg
      className={styles.sceneSvg}
      viewBox="0 0 560 330"
      role="img"
      aria-label="An animated unit circle with a moving radius, live sine and cosine values, and two scrolling waves."
    >
      <defs>
        <linearGradient id="trigRadiusGlow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e8bd78" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#f7dca4" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id="trigCircleFill" cx="45%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#e8bd78" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#e8bd78" stopOpacity="0.005" />
        </radialGradient>
      </defs>

      <text x="76" y="46" className={styles.svgEyebrow}>
        UNIT CIRCLE · r = 1
      </text>
      <text x="300" y="46" className={styles.svgEyebrow}>
        LIVE TRIG VALUES
      </text>

      <path
        d={`M ${WAVE_X - 12} ${WAVE_BASE} H ${WAVE_X + WAVE_WIDTH + 4}`}
        className={styles.waveBaseline}
      />
      <path
        d={`M ${WAVE_X} ${WAVE_BASE - WAVE_AMPLITUDE - 12} V ${
          WAVE_BASE + WAVE_AMPLITUDE + 22
        }`}
        className={styles.waveDivider}
      />
      <path d="M272 44V292" className={styles.dividerLine} />

      <text x="287" y={WAVE_BASE - WAVE_AMPLITUDE} className={styles.axisText}>
        1
      </text>
      <text x="287" y={WAVE_BASE + WAVE_AMPLITUDE + 3} className={styles.axisText}>
        −1
      </text>
      <text x="287" y={WAVE_BASE + 11} className={styles.axisText}>
        0
      </text>

      <g>
        <line
          x1={CX - RADIUS - 15}
          y1={CY}
          x2={CX + RADIUS + 20}
          y2={CY}
          className={styles.axisLine}
        />
        <line
          x1={CX}
          y1={CY - RADIUS - 20}
          x2={CX}
          y2={CY + RADIUS + 18}
          className={styles.axisLine}
        />
        <path
          d={`M ${CX + RADIUS + 20} ${CY} l -5 -2.6 v 5.2 z`}
          fill="rgba(232,189,120,0.32)"
        />
        <path
          d={`M ${CX} ${CY - RADIUS - 20} l -2.6 5 h 5.2 z`}
          fill="rgba(232,189,120,0.32)"
        />

        <circle
          cx={CX}
          cy={CY}
          r={RADIUS + 9}
          className={styles.trigCircleSoft}
        />
        <circle cx={CX} cy={CY} r={RADIUS} fill="url(#trigCircleFill)" />
        <circle cx={CX} cy={CY} r={RADIUS} className={styles.trigCircle} />

        <path d={arcPath} className={styles.trigArc} />

        <line
          x1={point.x}
          y1={point.y}
          x2={CX}
          y2={point.y}
          className={styles.trigProjection}
        />
        <line
          x1={point.x}
          y1={point.y}
          x2={point.x}
          y2={CY}
          className={styles.trigProjection}
        />
        <line
          x1={CX}
          y1={CY}
          x2={point.x}
          y2={point.y}
          stroke="url(#trigRadiusGlow)"
          strokeWidth="1.4"
        />

        <circle
          cx={point.x}
          cy={point.y}
          r="13"
          className={styles.trigPointHalo}
        />
        <circle cx={point.x} cy={point.y} r="4.3" className={styles.trigPoint} />
        <circle cx={CX} cy={CY} r="2.8" fill="rgba(248,243,232,0.6)" />

        <text
          x={angleLabel.x}
          y={angleLabel.y}
          textAnchor="middle"
          className={styles.svgFormulaRose}
        >
          θ
        </text>
        <text x={CX - 8} y={CY + RADIUS + 18} className={styles.microLabel}>
          cos θ
        </text>
        <text
          x={CX - RADIUS - 16}
          y={CY - 8}
          textAnchor="end"
          className={styles.microLabel}
        >
          sin θ
        </text>

        <text x={CX + RADIUS - 4} y={CY + 15} className={styles.axisText}>
          1
        </text>
        <text x={CX + 7} y={CY - RADIUS + 4} className={styles.axisText}>
          1
        </text>
      </g>

      <g>
        <polyline points={sinePoints} className={styles.waveSine} />
        <polyline points={cosinePoints} className={styles.waveCosine} />
        <line
          x1={WAVE_X}
          y1={WAVE_BASE - WAVE_AMPLITUDE - 9}
          x2={WAVE_X}
          y2={WAVE_BASE + WAVE_AMPLITUDE + 9}
          stroke="rgba(248,243,232,0.12)"
          strokeWidth="1"
          strokeDasharray="2 5"
        />
        <circle
          cx={WAVE_X}
          cy={sineDotY}
          r="3.2"
          className={styles.legendDotGold}
        />
        <circle
          cx={WAVE_X}
          cy={cosineDotY}
          r="2.4"
          className={styles.legendDotTeal}
          opacity="0.7"
        />

        <g transform="translate(404, 62)">
          <circle cx="0" cy="0" r="2.4" className={styles.legendDotGold} />
          <text x="8" y="3" className={styles.svgValueMuted}>
            sin θ
          </text>
          <circle cx="55" cy="0" r="2.4" className={styles.legendDotTeal} />
          <text x="63" y="3" className={styles.svgValueMuted}>
            cos θ
          </text>
        </g>

        <text x={WAVE_X + WAVE_WIDTH} y={WAVE_BASE + 32} textAnchor="end" className={styles.microLabel}>
          TIME →
        </text>
        <text x={WAVE_X} y={WAVE_BASE + 32} className={styles.svgFormulaRose}>
          now
        </text>
      </g>

      <g>
        <text x="300" y="90" className={styles.svgValueGold}>
          θ = {degrees.toFixed(1)}°
        </text>
        <text x="300" y="110" className={styles.svgValue}>
          sin θ = {sine.toFixed(2)}
        </text>
        <text x="300" y="128" className={styles.svgValue}>
          cos θ = {cosine.toFixed(2)}
        </text>

        <text x="404" y="90" className={styles.svgValueTeal}>
          {sine >= 0 ? "above" : "below"} the axis
        </text>
        <line
          x1="300"
          y1="280"
          x2="528"
          y2="280"
          className={styles.theoremRule}
        />
        <text x="300" y="301" className={styles.svgFormula}>
          sin²θ + cos²θ = 1
        </text>
        <text
          x="528"
          y="301"
          textAnchor="end"
          className={styles.svgValueMuted}
        >
          always 1
        </text>
      </g>
    </svg>
  );
}
