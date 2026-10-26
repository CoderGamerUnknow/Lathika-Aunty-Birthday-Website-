import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";
import styles from "./scenes.module.scss";

const POINT_COUNT = 52;
const CENTER_X = 280;
const CENTER_Y = 162;
const SCALE = 8.4;

const HEART_POINTS = Array.from({ length: POINT_COUNT }, (_, index) => {
  const t = (index / POINT_COUNT) * Math.PI * 2;
  const x = 16 * Math.sin(t) ** 3;
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);

  return {
    x: CENTER_X + x * SCALE,
    y: CENTER_Y - y * SCALE,
    index,
  };
});

const HEART_PATH = `${HEART_POINTS.map(
  (point, index) =>
    `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
).join(" ")} Z`;

const INDEX_A = Math.round(POINT_COUNT * 0.25);
const INDEX_B = Math.round(POINT_COUNT * 0.75);
const POINT_A = HEART_POINTS[INDEX_A];
const POINT_B = HEART_POINTS[INDEX_B];
const MIDPOINT = {
  x: (POINT_A.x + POINT_B.x) / 2,
  y: (POINT_A.y + POINT_B.y) / 2,
};

const gridLinesX = Array.from({ length: 14 }, (_, index) => 84 + index * 30);
const gridLinesY = Array.from({ length: 9 }, (_, index) => 42 + index * 30);

export function CoordinatesScene() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <svg
      className={styles.sceneSvg}
      viewBox="0 0 560 330"
      role="img"
      aria-label="A heart-shaped constellation plotted on a coordinate grid. Points A and B are joined by a chord, with midpoint M marked at the centre."
    >
      <defs>
        <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e9a6b8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#e8bd78" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="heartStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8bd78" />
          <stop offset="55%" stopColor="#f7dca4" />
          <stop offset="100%" stopColor="#e9a6b8" />
        </linearGradient>
        <filter id="heartBlurGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g>
        {gridLinesX.map((x) => (
          <line
            key={`x-${x}`}
            x1={x}
            y1="32"
            x2={x}
            y2="300"
            className={styles.gridLine}
          />
        ))}
        {gridLinesY.map((y) => (
          <line
            key={`y-${y}`}
            x1="68"
            y1={y}
            x2="512"
            y2={y}
            className={styles.gridLine}
          />
        ))}
      </g>

      <line
        x1="68"
        y1="162"
        x2="512"
        y2="162"
        className={styles.axisLine}
      />
      <line
        x1="280"
        y1="30"
        x2="280"
        y2="302"
        className={styles.axisLine}
      />
      <path d="M510 162l-6-2.8v5.6z" fill="rgba(232,189,120,0.35)" />
      <path d="M280 32l-2.8 6h5.6z" fill="rgba(232,189,120,0.35)" />
      <text x="508" y="180" textAnchor="end" className={styles.axisText}>
        x
      </text>
      <text x="289" y="42" className={styles.axisText}>
        y
      </text>
      <text x="286" y="175" className={styles.axisText}>
        O
      </text>

      <text x="74" y="52" className={styles.svgEyebrow}>
        COORDINATE PLANE
      </text>
      <text x="74" y="68" className={styles.svgValueMuted}>
        52 plotted points · one heart
      </text>

      <path d={HEART_PATH} className={styles.heartFill} />
      <path
        d={HEART_PATH}
        pathLength="1"
        className={
          prefersReducedMotion ? styles.heartStatic : styles.heartTrace
        }
      />

      {HEART_POINTS.filter((point) => point.index % 4 === 0).map((point) => (
        <circle
          key={point.index}
          cx={point.x}
          cy={point.y}
          r={point.index === 0 ? 2.8 : 1.9}
          className={styles.constellationDot}
          style={{
            animationDelay: `${0.55 + (point.index / POINT_COUNT) * 0.9}s`,
          }}
        />
      ))}

      <line
        x1={POINT_A.x}
        y1={POINT_A.y}
        x2={POINT_B.x}
        y2={POINT_B.y}
        className={styles.chordLine}
      />
      <line
        x1={MIDPOINT.x}
        y1={MIDPOINT.y}
        x2={MIDPOINT.x}
        y2={CENTER_Y}
        stroke="rgba(233,166,184,0.18)"
        strokeDasharray="2 5"
        strokeWidth="1"
      />

      <circle cx={POINT_A.x} cy={POINT_A.y} r="6.5" className={styles.pointMarker} />
      <circle cx={POINT_B.x} cy={POINT_B.y} r="6.5" className={styles.pointMarker} />
      <circle
        cx={MIDPOINT.x}
        cy={MIDPOINT.y}
        r="3.2"
        className={styles.midpointMarker}
      />

      <text
        x={POINT_A.x - 10}
        y={POINT_A.y - 12}
        textAnchor="end"
        className={styles.heartLabel}
      >
        A
      </text>
      <text
        x={POINT_B.x + 10}
        y={POINT_B.y - 12}
        className={styles.heartLabel}
      >
        B
      </text>
      <text
        x={MIDPOINT.x + 8}
        y={MIDPOINT.y - 11}
        className={`${styles.heartLabel} ${styles.heartLabelRose}`}
      >
        M
      </text>
      <text
        x={MIDPOINT.x + 18}
        y={MIDPOINT.y - 10}
        className={styles.pointSubLabel}
      >
        midpoint of AB
      </text>

      <path
        d="M88 92h17M96.5 83.5v17"
        stroke="rgba(142,216,202,0.32)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <text x="112" y="99" className={styles.microLabel}>
        PLOT A POINT
      </text>

      <text x="516" y="318" textAnchor="end" className={styles.svgFormula}>
        M = ((x₁ + x₂) / 2, (y₁ + y₂) / 2)
      </text>
    </svg>
  );
}
