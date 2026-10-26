import styles from "./SiteBackground.module.scss";

const FORMULAS = [
  {
    text: "sin²θ + cos²θ = 1",
    left: "4%",
    top: "20%",
    size: "1.05rem",
    delay: "-4s",
    tone: "gold",
  },
  {
    text: "y = ax² + bx + c",
    left: "78%",
    top: "16%",
    size: "0.92rem",
    delay: "-11s",
    tone: "cream",
    desktopOnly: true,
  },
  {
    text: "πr²",
    left: "88%",
    top: "62%",
    size: "1.5rem",
    delay: "-7s",
    tone: "rose",
  },
  {
    text: "(n − 2) × 180°",
    left: "7%",
    top: "68%",
    size: "0.9rem",
    delay: "-15s",
    tone: "teal",
    desktopOnly: true,
  },
  {
    text: "√(a² + b²)",
    left: "18%",
    top: "43%",
    size: "0.95rem",
    delay: "-2s",
    tone: "cream",
    desktopOnly: true,
  },
  {
    text: "Δ = b² − 4ac",
    left: "72%",
    top: "78%",
    size: "0.95rem",
    delay: "-9s",
    tone: "gold",
  },
  {
    text: "∞",
    left: "48%",
    top: "9%",
    size: "2rem",
    delay: "-13s",
    tone: "rose",
    desktopOnly: true,
  },
  {
    text: "θ",
    left: "93%",
    top: "38%",
    size: "2.4rem",
    delay: "-6s",
    tone: "cream",
  },
  {
    text: "tan θ = sin θ / cos θ",
    left: "2%",
    top: "92%",
    size: "0.84rem",
    delay: "-18s",
    tone: "gold",
    desktopOnly: true,
  },
  {
    text: "a² + b² = c²",
    left: "61%",
    top: "48%",
    size: "0.85rem",
    delay: "-5s",
    tone: "teal",
    desktopOnly: true,
  },
];

export function SiteBackground() {
  return (
    <div className={styles.background} aria-hidden="true">
      <div className={styles.grid} />
      <div className={styles.axisH} />
      <div className={styles.axisV} />
      <div className={styles.glowGold} />
      <div className={styles.glowRose} />
      <div className={styles.orbit}>
        <span className={styles.orbitPoint} />
      </div>
      <div className={styles.halo}>
        <span />
      </div>

      <div className={styles.floaters}>
        {FORMULAS.map((formula) => (
          <span
            key={formula.text}
            className={`${styles.floater} ${styles[formula.tone]} ${
              formula.desktopOnly ? styles.desktopOnly : ""
            }`}
            style={{
              left: formula.left,
              top: formula.top,
              fontSize: formula.size,
              animationDelay: formula.delay,
            }}
          >
            {formula.text}
          </span>
        ))}
      </div>

      <div className={styles.vignette} />
    </div>
  );
}
