import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";
import styles from "./scenes.module.scss";

const PARABOLA_PATH = "M 100 92 Q 280 388 460 92";

const verticalGrid = Array.from({ length: 15 }, (_, index) => 40 + index * 34);
const horizontalGrid = Array.from({ length: 9 }, (_, index) => 28 + index * 34);

export function ParabolaScene() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <svg
      className={styles.sceneSvg}
      viewBox="0 0 560 330"
      role="img"
      aria-label="A quadratic parabola traced across a coordinate grid, with a glowing star travelling along the curve to its turning point."
    >
      <defs>
        <linearGradient id="parabolaStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8ed8ca" />
          <stop offset="38%" stopColor="#e8bd78" />
          <stop offset="72%" stopColor="#f7dca4" />
          <stop offset="100%" stopColor="#e9a6b8" />
        </linearGradient>
        <radialGradient id="parabolaGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f7dca4" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f7dca4" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g>
        {verticalGrid.map((x) => (
          <line
            key={`v-${x}`}
            x1={x}
            y1="24"
            x2={x}
            y2="304"
            className={x === 280 ? styles.gridLineMajor : styles.gridLine}
          />
        ))}
        {horizontalGrid.map((y) => (
          <line
            key={`h-${y}`}
            x1="38"
            y1={y}
            x2="522"
            y2={y}
            className={styles.gridLine}
          />
        ))}
      </g>

      <line
        x1="42"
        y1="258"
        x2="520"
        y2="258"
        className={styles.axisLine}
      />
      <line
        x1="280"
        y1="26"
        x2="280"
        y2="302"
        className={styles.axisLine}
      />
      <path d="M518 258l-6-2.8v5.6z" fill="rgba(232,189,120,0.35)" />
      <path d="M280 28l-2.8 6h5.6z" fill="rgba(232,189,120,0.35)" />
      <text x="516" y="276" textAnchor="end" className={styles.axisText}>
        x
      </text>
      <text x="289" y="36" className={styles.axisText}>
        y
      </text>

      <line
        x1="280"
        y1="36"
        x2="280"
        y2="232"
        className={styles.dashLineTeal}
      />
      <text x="288" y="52" className={styles.microLabel}>
        AXIS OF SYMMETRY
      </text>

      <path d={PARABOLA_PATH} className={styles.parabolaBase} />
      <path
        d={PARABOLA_PATH}
        pathLength="1"
        className={
          prefersReducedMotion ? styles.parabolaSolid : styles.parabolaTrace
        }
      />

      <line
        x1="280"
        y1="240"
        x2="280"
        y2="258"
        className={styles.parabolaGuide}
      />
      <line
        x1="280"
        y1="240"
        x2="318"
        y2="240"
        className={styles.parabolaGuide}
      />
      <circle cx="280" cy="240" r="16" className={styles.vertexHalo} />
      <circle cx="280" cy="240" r="4" className={styles.vertexDot} />
      <text x="296" y="260" className={styles.vertexLabel}>
        V(h, k)
      </text>
      <text x="296" y="274" className={styles.microLabel}>
        THE TURNING POINT
      </text>

      {!prefersReducedMotion && (
        <>
          <g>
            <circle cx="0" cy="0" r="16" fill="url(#parabolaGlow)" />
            <circle cx="0" cy="0" r="9" className={styles.travelerGlow} />
            <circle cx="0" cy="0" r="3.7" className={styles.travelerDot} />
            <animateMotion
              dur="4.6s"
              repeatCount="indefinite"
              path={PARABOLA_PATH}
            />
          </g>
          <g opacity="0.55">
            <circle cx="0" cy="0" r="2.2" className={styles.travelerDot} />
            <animateMotion
              dur="4.6s"
              begin="-0.34s"
              repeatCount="indefinite"
              path={PARABOLA_PATH}
            />
          </g>
        </>
      )}

      <text x="74" y="52" className={styles.svgEyebrow}>
        QUADRATIC FAMILY
      </text>
      <text x="74" y="68" className={styles.svgValueMuted}>
        a &gt; 0 · opens upward
      </text>

      <text x="444" y="52" textAnchor="end" className={styles.svgFormula}>
        y = a(x − h)² + k
      </text>
      <text x="444" y="68" textAnchor="end" className={styles.svgValueMuted}>
        every curve has a turning point
      </text>

      <g>
        <path
          d="M102 104l-6 10M102 104l8 4"
          stroke="rgba(142,216,202,0.5)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M458 104l6 10M458 104l-8 4"
          stroke="rgba(233,166,184,0.5)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <text x="91" y="128" className={styles.microLabel}>
          RISE
        </text>
        <text x="438" y="128" className={styles.microLabel}>
          RISE
        </text>
      </g>

      <text x="74" y="294" className={styles.svgFormula}>
        Δ = b² − 4ac
      </text>
      <text x="444" y="294" textAnchor="end" className={styles.svgValueMuted}>
        the star always comes back up
      </text>
    </svg>
  );
}
