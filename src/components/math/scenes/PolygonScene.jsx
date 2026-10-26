import PropTypes from "prop-types";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion";
import { pointsToString, regularPolygonVertices } from "./sceneUtils";
import styles from "./scenes.module.scss";

const SIDES_SEQUENCE = [5, 6, 7, 3, 4];
const POLYGON_NAMES = {
  3: "triangle",
  4: "quadrilateral",
  5: "pentagon",
  6: "hexagon",
  7: "heptagon",
};

const center = { x: 170, y: 168 };
const radius = 98;

const buildInteriorSector = (vertex, previousVertex, nextVertex) => {
  const toNext = Math.atan2(
    -(nextVertex.y - vertex.y),
    nextVertex.x - vertex.x
  );
  const toPrevious = Math.atan2(
    -(previousVertex.y - vertex.y),
    previousVertex.x - vertex.x
  );

  let delta = toPrevious - toNext;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;

  const sectorRadius = 29;
  const steps = 14;
  const points = [vertex];

  for (let step = 0; step <= steps; step += 1) {
    const angle = toNext + (delta * step) / steps;
    points.push({
      x: vertex.x + sectorRadius * Math.cos(angle),
      y: vertex.y - sectorRadius * Math.sin(angle),
    });
  }

  return {
    path: `${points
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(
            2
          )}`
      )
      .join(" ")} Z`,
    labelPosition: {
      x: vertex.x + sectorRadius * 1.45 * Math.cos(toNext + delta / 2),
      y: vertex.y - sectorRadius * 1.45 * Math.sin(toNext + delta / 2),
    },
  };
};

export function PolygonScene({ step = 0 }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const safeStep = Math.max(0, step);
  const sides =
    SIDES_SEQUENCE[Math.max(0, safeStep - 1) % SIDES_SEQUENCE.length];
  const vertices = regularPolygonVertices(center.x, center.y, radius, sides);
  const interiorSum = (sides - 2) * 180;
  const interiorAngle = interiorSum / sides;
  const interiorSector = buildInteriorSector(
    vertices[0],
    vertices[vertices.length - 1],
    vertices[1]
  );

  return (
    <svg
      className={styles.sceneSvg}
      viewBox="0 0 560 330"
      role="img"
      aria-label={`A regular ${POLYGON_NAMES[sides]} with its interior angle sum of ${interiorSum} degrees illustrated by central fan triangles.`}
    >
      <defs>
        <radialGradient id="polygonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e8bd78" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#e8bd78" stopOpacity="0" />
        </radialGradient>
      </defs>

      <text x="74" y="48" className={styles.svgEyebrow}>
        POLYGON FAMILY · n = {sides}
      </text>
      <text x="74" y="64" className={styles.svgValueMuted}>
        many sides, one complete shape
      </text>

      <circle
        cx={center.x}
        cy={center.y}
        r={radius + 20}
        fill="url(#polygonGlow)"
      />
      <circle
        cx={center.x}
        cy={center.y}
        r={radius}
        className={styles.circumCircle}
      />

      <g
        className={
          prefersReducedMotion ? styles.polygonStatic : styles.polygonEnter
        }
      >
        {vertices.map((vertex, index) => {
          const nextVertex = vertices[(index + 1) % vertices.length];
          return (
            <path
              key={`wedge-${index}`}
              d={`M ${center.x} ${center.y} L ${vertex.x.toFixed(
                2
              )} ${vertex.y.toFixed(2)} L ${nextVertex.x.toFixed(
                2
              )} ${nextVertex.y.toFixed(2)} Z`}
              className={`${styles.wedge} ${
                index % 2 === 0 ? styles.wedgeGold : styles.wedgeRose
              }`}
              style={{ animationDelay: `${0.18 + index * 0.045}s` }}
            />
          );
        })}

        <polygon
          points={pointsToString(vertices)}
          className={styles.polygonShape}
        />

        {vertices.map((vertex, index) => (
          <circle
            key={`vertex-${index}`}
            cx={vertex.x}
            cy={vertex.y}
            r="3.1"
            className={styles.vertexDot}
          />
        ))}
      </g>

      <path d={interiorSector.path} className={styles.interiorSector} />
      <text
        x={interiorSector.labelPosition.x}
        y={interiorSector.labelPosition.y}
        textAnchor="middle"
        className={styles.interiorLabel}
      >
        {interiorAngle.toFixed(1)}°
      </text>

      <circle cx={center.x} cy={center.y} r="2.7" className={styles.centerDot} />
      <line
        x1={center.x}
        y1={center.y - 12}
        x2={center.x}
        y2={center.y - radius + 8}
        className={styles.circumCircle}
      />
      <text
        x={center.x}
        y={center.y + 17}
        textAnchor="middle"
        className={styles.polygonStepLabel}
      >
        {sides}
      </text>

      <line
        x1="312"
        y1="70"
        x2="312"
        y2="280"
        className={styles.dividerLine}
      />

      <g className={styles.formulaRow}>
        <text x="334" y="82" className={styles.svgEyebrow}>
          INTERIOR ANGLE SUM
        </text>
        <text x="334" y="112" className={styles.svgBigFormula}>
          (n − 2) × 180°
        </text>
        <text x="334" y="137" className={styles.svgFormula}>
          ({sides} − 2) × 180° = {interiorSum}°
        </text>
      </g>

      <line
        x1="334"
        y1="155"
        x2="524"
        y2="155"
        className={styles.dividerLine}
      />

      <g className={styles.formulaRowLate}>
        <text x="334" y="178" className={styles.svgValueGold}>
          Interior sum = {interiorSum}°
        </text>
        <text x="334" y="198" className={styles.svgValue}>
          Each interior ≈ {interiorAngle.toFixed(1)}°
        </text>
        <text x="334" y="218" className={styles.svgValueTeal}>
          Exterior sum = 360°
        </text>
      </g>

      <line
        x1="334"
        y1="237"
        x2="524"
        y2="237"
        className={styles.dividerLine}
      />

      <text x="334" y="260" className={styles.svgFormulaRose}>
        regular {POLYGON_NAMES[sides]}
      </text>
      <text x="334" y="278" className={styles.svgValueMuted}>
        n sides · n angles · one family
      </text>

      <circle
        cx="504"
        cy="74"
        r="15"
        fill="none"
        stroke="rgba(232,189,120,0.16)"
        strokeDasharray="1 4"
      />
      <text
        x="504"
        y="78"
        textAnchor="middle"
        className={styles.svgValueGold}
      >
        {sides}
      </text>
    </svg>
  );
}

PolygonScene.propTypes = {
  step: PropTypes.number,
};
