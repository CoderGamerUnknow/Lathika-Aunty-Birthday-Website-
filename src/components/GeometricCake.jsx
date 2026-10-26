import styles from "./GeometricCake.module.scss";

const ORBIT_TICKS = Array.from({ length: 36 }, (_, index) => {
  const angle = (index * 10 * Math.PI) / 180;
  const inner = index % 3 === 0 ? 154 : 160;
  const outer = 170;

  return {
    x1: 210 + Math.cos(angle) * inner,
    y1: 205 + Math.sin(angle) * inner,
    x2: 210 + Math.cos(angle) * outer,
    y2: 205 + Math.sin(angle) * outer,
    strong: index % 3 === 0,
  };
});

const SPRINKLES = [
  [112, 296, "#e9a6b8"],
  [150, 316, "#8ed8ca"],
  [196, 292, "#f7dca4"],
  [242, 318, "#e9a6b8"],
  [290, 296, "#8ed8ca"],
  [322, 326, "#f7dca4"],
  [142, 238, "#f7dca4"],
  [190, 250, "#8ed8ca"],
  [252, 236, "#e9a6b8"],
  [296, 250, "#f7dca4"],
  [174, 192, "#e9a6b8"],
  [214, 200, "#f7dca4"],
  [258, 190, "#8ed8ca"],
];

export function GeometricCake() {
  return (
    <svg
      className={styles.cakeSvg}
      viewBox="0 0 420 410"
      role="img"
      aria-label="A geometric three-tier birthday cake in gold, rose and teal, with three candles and a slow orbiting mathematical ring."
    >
      <defs>
        <linearGradient id="cakeTier" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b2439" stopOpacity="0.96" />
          <stop offset="100%" stopColor="#0b1120" stopOpacity="0.96" />
        </linearGradient>
        <linearGradient id="cakeTop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7dca4" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#e8bd78" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="icingGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f7dca4" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#e8bd78" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="flameGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff3d3" />
          <stop offset="48%" stopColor="#f7dca4" />
          <stop offset="100%" stopColor="#e9a6b8" />
        </linearGradient>
        <radialGradient id="cakeHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8bd78" stopOpacity="0.16" />
          <stop offset="60%" stopColor="#e8bd78" stopOpacity="0.035" />
          <stop offset="100%" stopColor="#e8bd78" stopOpacity="0" />
        </radialGradient>
        <pattern
          id="cakeGrid"
          width="18"
          height="18"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M18 0H0V18"
            fill="none"
            stroke="rgba(232,189,120,0.12)"
            strokeWidth="0.6"
          />
        </pattern>
      </defs>

      <circle cx="210" cy="205" r="192" fill="url(#cakeHalo)" />

      <g className={styles.orbit}>
        <circle
          cx="210"
          cy="205"
          r="174"
          fill="none"
          stroke="rgba(232,189,120,0.2)"
          strokeWidth="1"
          strokeDasharray="2 11"
        />
        <circle
          cx="210"
          cy="205"
          r="147"
          fill="none"
          stroke="rgba(248,243,232,0.07)"
          strokeWidth="1"
        />
        {ORBIT_TICKS.map((tick, index) => (
          <line
            key={index}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={
              tick.strong
                ? "rgba(232,189,120,0.28)"
                : "rgba(248,243,232,0.09)"
            }
            strokeWidth={tick.strong ? 1 : 0.8}
          />
        ))}
        <circle
          cx="210"
          cy="31"
          r="4"
          fill="rgba(247,220,164,0.85)"
          className={styles.orbitPoint}
        />
        <text
          x="210"
          y="24"
          textAnchor="middle"
          fontFamily="Fraunces, Georgia, serif"
          fontSize="12"
          fontStyle="italic"
          fill="rgba(232,189,120,0.48)"
        >
          1
        </text>
      </g>

      <g className={styles.cakeFloat}>
        <ellipse
          cx="210"
          cy="359"
          rx="140"
          ry="17"
          fill="rgba(232,189,120,0.075)"
          opacity="0.7"
        />

        <g>
          <rect
            x="76"
            y="272"
            width="268"
            height="72"
            rx="18"
            fill="url(#cakeTier)"
            stroke="rgba(232,189,120,0.48)"
            strokeWidth="1.2"
          />
          <rect
            x="76"
            y="272"
            width="268"
            height="72"
            rx="18"
            fill="url(#cakeGrid)"
            opacity="0.65"
          />
          <ellipse
            cx="210"
            cy="272"
            rx="134"
            ry="17"
            fill="url(#cakeTop)"
            stroke="rgba(232,189,120,0.55)"
            strokeWidth="1.2"
          />
          <path
            d="M78 277c19 8 34-4 52 1 17 5 34 11 51 5 18-6 31-10 50-4 18 6 33 10 52 3 18-7 35-6 50-1"
            fill="none"
            stroke="rgba(233,166,184,0.62)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M102 288v12c0 4 7 4 7 0v-12M198 292v16c0 4 7 4 7 0v-16M286 289v12c0 4 7 4 7 0v-12"
            fill="none"
            stroke="url(#icingGradient)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text
            x="210"
            y="327"
            textAnchor="middle"
            fontFamily="Space Grotesk, sans-serif"
            fontSize="7"
            letterSpacing="3.1"
            fill="rgba(247,220,164,0.58)"
          >
            HAPPY BIRTHDAY
          </text>
        </g>

        <g>
          <rect
            x="110"
            y="211"
            width="200"
            height="64"
            rx="16"
            fill="url(#cakeTier)"
            stroke="rgba(232,189,120,0.48)"
            strokeWidth="1.2"
          />
          <rect
            x="110"
            y="211"
            width="200"
            height="64"
            rx="16"
            fill="url(#cakeGrid)"
            opacity="0.6"
          />
          <ellipse
            cx="210"
            cy="211"
            rx="100"
            ry="14"
            fill="url(#cakeTop)"
            stroke="rgba(232,189,120,0.55)"
            strokeWidth="1.2"
          />
          <path
            d="M112 216c15 6 28-3 42 1 14 4 27 9 42 5 15-5 25-8 41-3 15 5 28 8 43 2 14-6 26-5 39-1"
            fill="none"
            stroke="rgba(233,166,184,0.62)"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M140 226v10c0 4 6 4 6 0v-10M222 231v13c0 4 6 4 6 0v-13M284 227v10c0 4 6 4 6 0v-10"
            fill="none"
            stroke="url(#icingGradient)"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          <text
            x="210"
            y="258"
            textAnchor="middle"
            fontFamily="Fraunces, Georgia, serif"
            fontSize="15"
            fontStyle="italic"
            fill="rgba(247,220,164,0.68)"
          >
            π
          </text>
        </g>

        <g>
          <rect
            x="140"
            y="161"
            width="140"
            height="54"
            rx="14"
            fill="url(#cakeTier)"
            stroke="rgba(232,189,120,0.5)"
            strokeWidth="1.2"
          />
          <rect
            x="140"
            y="161"
            width="140"
            height="54"
            rx="14"
            fill="url(#cakeGrid)"
            opacity="0.55"
          />
          <ellipse
            cx="210"
            cy="161"
            rx="70"
            ry="11"
            fill="url(#cakeTop)"
            stroke="rgba(232,189,120,0.58)"
            strokeWidth="1.2"
          />
          <path
            d="M141 165c11 5 21-2 32 1 11 4 21 7 32 4 12-4 20-6 31-2 11 4 21 6 32 1 11-5 20-4 30-1"
            fill="none"
            stroke="rgba(233,166,184,0.66)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M176 190c4-4 8-4 12 0M214 194c4-4 8-4 12 0M252 190c4-4 8-4 12 0"
            fill="none"
            stroke="rgba(247,220,164,0.56)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </g>

        <g>
          {[180, 210, 240].map((x, index) => (
            <g key={x}>
              <line
                x1={x}
                y1="158"
                x2={x}
                y2="117"
                stroke="rgba(248,243,232,0.58)"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <line
                x1={x}
                y1="143"
                x2={x}
                y2="158"
                stroke="rgba(233,166,184,0.62)"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <line
                x1={x}
                y1="117"
                x2={x}
                y2="112"
                stroke="rgba(68,52,36,0.9)"
                strokeWidth="1"
              />
              <g
                className={styles.flame}
                style={{ animationDelay: `${index * -0.45}s` }}
              >
                <path
                  d={`M ${x} 111 C ${x - 7} 103 ${x - 3} 94 ${x} 89 C ${
                    x + 3
                  } 94 ${x + 7} 103 ${x} 111 Z`}
                  fill="url(#flameGradient)"
                />
                <path
                  d={`M ${x} 108 C ${x - 2.5} 104 ${x - 1} 100 ${x} 98 C ${
                    x + 1
                  } 100 ${x + 2.5} 104 ${x} 108 Z`}
                  fill="#fff8e8"
                  opacity="0.8"
                />
              </g>
              <circle
                cx={x}
                cy="101"
                r="15"
                fill="rgba(247,220,164,0.05)"
              />
            </g>
          ))}
        </g>

        {SPRINKLES.map(([x, y, color], index) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={index % 3 === 0 ? 2.2 : 1.5}
            fill={color}
            opacity="0.78"
          />
        ))}
      </g>

      <g className={styles.stars} aria-hidden="true">
        <path
          d="M86 122l2.4 6.6 6.6 2.4-6.6 2.4L86 140l-2.4-6.6-6.6-2.4 6.6-2.4z"
          fill="rgba(247,220,164,0.6)"
        />
        <path
          d="M339 211l1.8 4.8 4.8 1.8-4.8 1.8-1.8 4.8-1.8-4.8-4.8-1.8 4.8-1.8z"
          fill="rgba(233,166,184,0.52)"
        />
        <circle cx="331" cy="116" r="2" fill="rgba(142,216,202,0.58)" />
        <circle cx="94" cy="249" r="1.6" fill="rgba(247,220,164,0.48)" />
      </g>
    </svg>
  );
}
