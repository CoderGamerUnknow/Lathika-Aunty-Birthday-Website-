import { useEffect, useRef, useState } from "react";
import styles from "./shareButton.module.scss";

const SHARE_TEXT =
  "A little mathematics, a lot of love — a birthday tribute from Grade 10.";

const legacyCopy = (value) => {
  const field = document.createElement("textarea");

  field.value = value;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();

  let copied = false;

  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  field.remove();
  return copied;
};

export function ShareButton() {
  const [status, setStatus] = useState("");
  const timerRef = useRef(0);

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
    },
    []
  );

  const announce = (message) => {
    setStatus(message);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setStatus(""), 3400);
  };

  const share = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Happy Birthday, Lathika Aunty",
          text: SHARE_TEXT,
          url,
        });
        announce("Thank you for passing it on");
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      announce("Link copied to clipboard");
      return;
    } catch {
      // Clipboard API needs a secure context; fall back to a temporary field.
    }

    announce(
      legacyCopy(url)
        ? "Link copied to clipboard"
        : "Copy the address from your browser bar"
    );
  };

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.button} onClick={share}>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className={styles.icon}
        >
          <path
            d="M10 13V3m0 0L6.5 6.5M10 3l3.5 3.5M4 11.5v3A1.5 1.5 0 0 0 5.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-3"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Share this tribute
      </button>

      <span className={styles.status} role="status" aria-live="polite">
        {status}
      </span>
    </div>
  );
}
