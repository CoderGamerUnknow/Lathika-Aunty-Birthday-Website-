import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";
import { describeArc, formatDegrees, polar } from "./sceneUtils";
import styles from "./scenes.module.scss";

const CX = 176;
const CY = 168;
const RADIUS = 94;
const TANGENT_LENGTH = 108;

export function CircleScene() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const frameRef = useRef(0);
  const angleRef = useRef(2.42);
  const angle = angleRef.current;

  useEffect(() => {
    if (prefersReducedMotion) {
      angleRef.current = 2.42;
      return undefined;
    }

    let previous = performance.now();
    let current = 2.42;

    const animate = (now) => {
      const delta = Math.min(now - previous, 48);
      previous = now;
      current = (current + delta * 0.00026) % (Math.PI * 2);
      angleRef.current = current;
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameRef.current);
  }, [prefersReducedMotion]);

  const point = polar(CX, CY, RADIUS, angle);
  const radialUnit = {
    x: (CX - point.x) / RADIUS,
    y: (CY - point.y) / RADIUS,
  };
  const tangentUnit = { x: -radialUnit.y, y: radialUnit.x };
  const tangentA = {
    x: point.x + tangentUnit.x * TANGENT_LENGTH,
    y: point.y + tangentUnit.y * TANGENT_LENGTH,
  };
  const tangentB = {
    x: point.x - tangentUnit.x * TANGENT_LENGTH,
    y: point.y - tangentUnit.y * TANGENT_LENGTH,
  };
  const rightAngle = [
    {
      x: point.x + radialUnit.x * 13,
      y: point.y + radialUnit.y * 13,
    },
    {
      x:
        point.x +
        radialUnit.x * 13 +
        tangentUnit.x * 13,
      y:
        point.y +
        radialUnit.y * 13 +
        tangentUnit.y * 13,
    },
    {
      x: point.x + tangentUnit.x * 13,
      y: point.y + tangentUnit.y * 13,
    },
  ];
  const angleLabel = polar(CX, CY, RADIUS * 0.44, angle / 2);
  const pointLabel = polar(CX, CY, RADIUS + 17, angle);
  const degrees = formatDegrees(angle);

  return (
    <svg
      className={styles.sceneSvg}
      viewBox="0 0 560 330"
      role="img"
      aria-label="An animated circle with a radius to a moving point and a tangent line at that point. A right-angle marker shows the tangent is perpendicular to the radius."
    >
      <defs>
        <radialGradient id="circleFill" cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#e8bd78" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#e8bd78" stopOpacity="0.005" />
        </radialGradient>
        <radialGradient id="contactGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e9a6b8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#e9a6b8" stopOpacity="0" />
        </radialGradient>
      </defs>

      <text x="76" y="48" className={styles.svgEyebrow}>
        TANGENT–RADIUS THEOREM
      </text>
      <text x="76" y="64" className={styles.svgValueMuted}>
        one point of contact, one perfect angle
      </text>

      <g>
        <circle cx={CX} cy={CY} r={RADIUS + 11} className={styles.circleSoft} />
        <circle cx={CX} cy={CY} r={RADIUS} fill="url(#circleFill)" />
        <circle cx={CX} cy={CY} r={RADIUS} className={styles.circleLine} />

        <path
          d={`M ${CX - RADIUS - 22} ${CY} H ${CX + RADIUS + 22}`}
          className={styles.axisLineSoft}
        />
        <path
          d={`M ${CX} ${CY - RADIUS - 22} V ${CY + RADIUS + 22}`}
          className={styles.axisLineSoft}
        />

        <path
          d={`M ${CX} ${CY} L ${point.x} ${point.y} L ${tangentA.x} ${tangentA.y} Z`}
          className={styles.triangleFill}
        />

        <path
          d={describeArc(CX, CY, RADIUS + 5, 0, angle)}
          className={styles.circleArc}
        />

        <line
          x1={tangentA.x}
          y1={tangentA.y}
          x2={tangentB.x}
          y2={tangentB.y}
          className={styles.tangentLine}
        />
        <line
          x1={CX}
          y1={CY}
          x2={point.x}
          y2={point.y}
          className={styles.radiusLine}
        />

        <circle cx={point.x} cy={point.y} r="24" fill="url(#contactGlow)" />
        <circle cx={point.x} cy={point.y} r="16" className={styles.contactHalo} />
        <circle cx={point.x} cy={point.y} r="4.4" className={styles.contactPoint} />
        <circle cx={CX} cy={CY} r="3.2" className={styles.centerPoint} />

        <path
          d={`M ${rightAngle[0].x} ${rightAngle[0].y} L ${rightAngle[1].x} ${rightAngle[1].y} L ${rightAngle[2].x} ${rightAngle[2].y}`}
          className={styles.rightAngle}
        />

        <text x={CX - 14} y={CY + 18} className={styles.pointLabel}>
          O
        </text>
        <text
          x={pointLabel.x}
          y={pointLabel.y}
          textAnchor="middle"
          className={styles.pointLabel}
        >
          P
        </text>
        <text
          x={tangentA.x + (tangentUnit.x >= 0 ? 8 : -8)}
          y={tangentA.y + (tangentUnit.y >= 0 ? 14 : -8)}
          textAnchor={tangentUnit.x >= 0 ? "start" : "end"}
          className={styles.heartLabelRose}
        >
          T
        </text>
        <text
          x={angleLabel.x}
          y={angleLabel.y}
          textAnchor="middle"
          className={styles.svgFormulaRose}
        >
          θ
        </text>
        <text x={CX + 8} y={CY - 8} className={styles.pointSubLabel}>
          r
        </text>
      </g>

      <g>
        <text x="330" y="62" className={styles.svgEyebrow}>
          RIGHT HERE, ALWAYS
        </text>
        <text x="330" y="112" className={styles.svgBigNumber}>
          90°
        </text>
        <text x="330" y="134" className={styles.svgValueMuted}>
          ∠OPT · no exceptions
        </text>
        <line
          x1="330"
          y1="150"
          x2="524"
          y2="150"
          className={styles.dividerLine}
        />

        <text x="330" y="176" className={styles.svgValueGold}>
          θ = {degrees.toFixed(1)}°
        </text>
        <text x="330" y="196" className={styles.svgValue}>
          OP = r
        </text>
        <text x="330" y="216" className={styles.svgValueTeal}>
          PT ⟂ OP
        </text>

        <line
          x1="330"
          y1="238"
          x2="524"
          y2="238"
          className={styles.dividerLine}
        />
        <text x="330" y="260" className={styles.svgFormula}>
          tangent ⊥ radius
        </text>
        <text x="330" y="280" className={styles.svgValueMuted}>
          a single touch, a lasting mark
        </text>
        <circle
          cx="514"
          cy="277"
          r="9"
          fill="none"
          stroke="rgba(233,166,184,0.22)"
          strokeDasharray="1 4"
        />
      </g>
    </svg>
  );
}
