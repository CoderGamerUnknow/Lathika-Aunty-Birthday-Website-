import { useEffect, useRef, useState } from "react";
import { renderCertificate } from "./certificate";
import styles from "./certificate.module.scss";

const DEFAULT_NAME = "A student of Grade 10";

export function GiftCertificate() {
  const canvasRef = useRef(null);
  const [name, setName] = useState(DEFAULT_NAME);
  const [fontsReady, setFontsReady] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadFonts = async () => {
      try {
        if (document.fonts?.load) {
          await Promise.all([
            document.fonts.load('italic 300 104px "Fraunces"'),
            document.fonts.load('300 62px "Fraunces"'),
            document.fonts.load('500 19px "Space Grotesk"'),
          ]);
        }
      } catch {
        // Canvas falls back to local serif/sans stacks.
      }

      if (!cancelled) setFontsReady(true);
    };

    loadFonts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!fontsReady) return;

    renderCertificate(canvasRef.current, name);
  }, [name, fontsReady]);

  useEffect(() => {
    if (!downloaded) return undefined;

    const timeout = window.setTimeout(() => setDownloaded(false), 4000);

    return () => window.clearTimeout(timeout);
  }, [downloaded]);

  const download = () => {
    const canvas = canvasRef.current;

    if (!canvas || !canvas.toBlob) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "lathika-aunty-gratitude-certificate.png";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => URL.revokeObjectURL(url), 1500);
      setDownloaded(true);
    }, "image/png");
  };

  return (
    <section
      id="certificate"
      className={styles.certificate}
      aria-labelledby="certificate-title"
    >
      <div className={styles.inner}>
        <div className={styles.copy} data-reveal>
          <span className={styles.kicker}>A keepsake · signed &amp; sealed</span>
          <h2 id="certificate-title" className={styles.title}>
            Take a little proof
            <em>of this year home.</em>
          </h2>
          <p className={styles.lead}>
            Print it, pin it above a desk, or keep it in your photos. Put your
            name on the certificate — the gratitude was always a shared subject.
          </p>

          <label className={styles.field}>
            <span>Name on the certificate</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={48}
              placeholder={DEFAULT_NAME}
              autoComplete="name"
            />
          </label>

          <div className={styles.actions}>
            <button type="button" className={styles.download} onClick={download}>
              Download PNG
              <span aria-hidden="true">↓</span>
            </button>
            <span className={styles.note}>
              {downloaded
                ? "Saved to your downloads — happy birthday!"
                : "1600 × 1131 px · ready to print"}
            </span>
          </div>

          <p className={styles.fineprint}>
            <span aria-hidden="true">∴</span>
            Every name belongs on it. Yours does too.
          </p>
        </div>

        <figure className={styles.preview} data-reveal>
          <div className={styles.frame}>
            <span className={styles.frameCorner} aria-hidden="true" />
            <span className={styles.frameCorner} aria-hidden="true" />
            <span className={styles.frameCorner} aria-hidden="true" />
            <span className={styles.frameCorner} aria-hidden="true" />
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              role="img"
              aria-label={`Preview of a certificate of infinite gratitude awarded to ${
                name.trim() || DEFAULT_NAME
              }.`}
            />
          </div>
          <figcaption className={styles.caption}>
            Live preview · updates as you type
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
