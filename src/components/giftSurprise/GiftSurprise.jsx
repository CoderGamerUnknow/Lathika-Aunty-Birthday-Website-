import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./giftSurprise.module.scss";

const SPARKLES = [
  { left: "8%", top: "18%", delay: "0s", size: "0.8rem" },
  { left: "86%", top: "12%", delay: "-1.4s", size: "0.6rem" },
  { left: "92%", top: "58%", delay: "-2.8s", size: "0.9rem" },
  { left: "4%", top: "62%", delay: "-3.6s", size: "0.55rem" },
  { left: "74%", top: "82%", delay: "-5.1s", size: "0.7rem" },
  { left: "18%", top: "86%", delay: "-2.1s", size: "0.5rem" },
];

export function GiftSurprise({ onCelebrate }) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen((previous) => {
      const next = !previous;

      if (next) {
        onCelebrate?.({ count: 68, spread: 1.15 });
      }

      return next;
    });
  };

  return (
    <section
      id="surprise"
      className={styles.surprise}
      aria-labelledby="surprise-title"
    >
      <div className={styles.inner}>
        <div className={styles.copy} data-reveal>
          <span className={styles.kicker}>One more thing · unopened</span>
          <h2 id="surprise-title" className={styles.title}>
            A little gift,
            <em>hidden in plain sight.</em>
          </h2>
          <p className={styles.lead}>
            Some presents cannot be wrapped in paper. This one has been sitting
            at the back of the classroom all year — and it has your name on it.
          </p>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.toggle}
              onClick={toggle}
              aria-expanded={open}
              aria-controls="surprise-letter"
            >
              {open ? "Wrap it back up" : "Open the gift"}
              <span aria-hidden="true">{open ? "↺" : "✦"}</span>
            </button>
            <span className={styles.hint}>
              {open ? "The box will wait for the next visitor." : "or tap the box"}
            </span>
          </div>
        </div>

        <div className={`${styles.stage} ${open ? styles.stageOpen : ""}`}>
          <div className={styles.sparkles} aria-hidden="true">
            {SPARKLES.map((sparkle) => (
              <span
                key={`${sparkle.left}-${sparkle.top}`}
                style={{
                  left: sparkle.left,
                  top: sparkle.top,
                  fontSize: sparkle.size,
                  animationDelay: sparkle.delay,
                }}
              >
                ✦
              </span>
            ))}
          </div>

          <button
            type="button"
            className={`${styles.gift} ${open ? styles.giftOpen : ""}`}
            onClick={toggle}
            aria-label={open ? "Close the gift box" : "Open the gift box"}
            aria-expanded={open}
            aria-controls="surprise-letter"
          >
            <span className={styles.giftGlow} aria-hidden="true" />

            <span className={styles.box} aria-hidden="true">
              <span className={styles.ribbonVertical} />
              <span className={styles.ribbonHorizontal} />
            </span>

            <span className={styles.lid} aria-hidden="true">
              <span className={styles.lidRibbon} />
            </span>

            <span className={styles.bow} aria-hidden="true">
              <span className={styles.loopLeft} />
              <span className={styles.loopRight} />
              <span className={styles.knot} />
            </span>

            <span className={styles.tag} aria-hidden="true">
              For Lathika Aunty
            </span>
          </button>

          <div
            id="surprise-letter"
            className={`${styles.letter} ${open ? styles.letterOpen : ""}`}
            aria-hidden={!open}
          >
            <span className={styles.letterKicker}>The gift · unwrapped</span>
            <h3 className={styles.letterTitle}>
              You already gave us the best one.
            </h3>
            <p className={styles.letterBody}>
              It was never in this box. It was the classroom where it felt safe
              to say “I don&apos;t understand yet”, the patience that made
              rewriting an answer feel normal, and the quiet belief that every
              one of us would get there.
            </p>
            <p className={styles.letterBody}>
              We could not gift-wrap that back to you — so we built you a small
              corner of the internet instead. Happy birthday, Aunty.
            </p>
            <div className={styles.letterFoot}>
              <span className={styles.signature}>— with love, your students</span>
              <span className={styles.seal} aria-hidden="true">
                ∞
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

GiftSurprise.propTypes = {
  onCelebrate: PropTypes.func,
};
