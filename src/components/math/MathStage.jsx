import PropTypes from "prop-types";
import { DEMOS } from "./demos";
import { CircleScene } from "./scenes/CircleScene";
import { CoordinatesScene } from "./scenes/CoordinatesScene";
import { ParabolaScene } from "./scenes/ParabolaScene";
import { PolygonScene } from "./scenes/PolygonScene";
import { TrigScene } from "./scenes/TrigScene";
import styles from "./mathStage.module.scss";

const SCENES = {
  trigonometry: TrigScene,
  parabola: ParabolaScene,
  coordinates: CoordinatesScene,
  circles: CircleScene,
  polygons: PolygonScene,
};

export function MathStage({ active, step = 0 }) {
  const index = Math.max(
    0,
    DEMOS.findIndex((demo) => demo.id === active)
  );
  const demo = DEMOS[index] || DEMOS[0];
  const Scene = SCENES[demo.id];

  return (
    <div
      className={styles.stage}
      id="math-stage"
      role="region"
      aria-label={`Interactive ${demo.label} demonstration`}
    >
      <div className={styles.stageTop}>
        <div>
          <span className={styles.eyebrow}>{demo.eyebrow}</span>
          <p className={styles.title}>{demo.title}</p>
        </div>
        <span className={styles.index} aria-hidden="true">
          {String(index + 1).padStart(2, "0")} / 05
        </span>
      </div>

      <div className={styles.sceneFrame} key={`${demo.id}-${step}`}>
        <Scene step={step} />
      </div>

      <div className={styles.stageFooter}>
        <p className={styles.caption}>{demo.caption}</p>
        <div className={styles.meta}>
          <span className={styles.formula}>
            <span aria-hidden="true">∴</span>
            {demo.formula}
          </span>
          <span className={styles.hint}>{demo.hint}</span>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {demo.label}: {demo.title}
      </p>
    </div>
  );
}

MathStage.propTypes = {
  active: PropTypes.string.isRequired,
  step: PropTypes.number,
};
