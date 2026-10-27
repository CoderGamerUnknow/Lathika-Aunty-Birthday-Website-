import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import styles from "./wishesWall.module.scss";

const STORAGE_KEY = "lathika-tribute-wishes-v1";

const SEED_WISHES = [
  {
    id: "seed-1",
    name: "Amara",
    role: "Grade 10 · B",
    message:
      "You turned a subject I was afraid of into the class I looked forward to. Happy birthday, Aunty!",
    createdAt: "2026-10-24T09:12:00.000Z",
    symbol: "π",
  },
  {
    id: "seed-2",
    name: "Ravi",
    role: "Grade 10 · A",
    message:
      "Thank you for staying back after school to explain the same theorem four times. I finally got it — and I still remember it.",
    createdAt: "2026-10-24T16:40:00.000Z",
    symbol: "Σ",
  },
  {
    id: "seed-3",
    name: "Nila",
    role: "Grade 10 · C",
    message:
      "You always noticed when someone went quiet. That is its own kind of genius, and we are grateful for it.",
    createdAt: "2026-10-25T07:05:00.000Z",
    symbol: "∞",
  },
  {
    id: "seed-4",
    name: "The Grade 10 class",
    role: "Mathematics",
    message:
      "For every red pen that said “almost there” instead of “wrong”, thank you. You made trying feel safe.",
    createdAt: "2026-10-25T12:20:00.000Z",
    symbol: "△",
  },
];

const SYMBOLS = ["π", "Σ", "∞", "△", "√", "θ", "Δ"];

const isValidWish = (wish) =>
  wish &&
  typeof wish.id === "string" &&
  typeof wish.name === "string" &&
  typeof wish.message === "string";

const readWishes = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (!stored) return SEED_WISHES;

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) return SEED_WISHES;

    const cleaned = parsed.filter(isValidWish);

    return cleaned.length > 0 ? cleaned : [];
  } catch {
    return SEED_WISHES;
  }
};

const formatDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
};

export function WishesWall({ onCelebrate }) {
  const [wishes, setWishes] = useState(SEED_WISHES);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setWishes(readWishes());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    } catch {
      // Storage can be unavailable in private mode — the wall still works.
    }
  }, [wishes, hydrated]);

  const remaining = 240 - message.length;

  const countLabel = useMemo(() => {
    if (wishes.length === 1) return "1 wish signed";
    return `${wishes.length} wishes signed`;
  }, [wishes.length]);

  const submit = (event) => {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanMessage) {
      setStatus("Please add your name and a wish before signing.");
      return;
    }

    const wish = {
      id: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: cleanName.slice(0, 40),
      role: role.trim().slice(0, 40) || "A well-wisher",
      message: cleanMessage.slice(0, 240),
      createdAt: new Date().toISOString(),
      symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    };

    setWishes((previous) => [wish, ...previous]);
    setName("");
    setRole("");
    setMessage("");
    setStatus(`Thank you, ${wish.name} — your wish is on the wall.`);
    onCelebrate?.({ count: 34, spread: 0.92 });
  };

  const removeWish = (id) => {
    setWishes((previous) => previous.filter((wish) => wish.id !== id));
    setStatus("Wish removed from this browser.");
  };

  return (
    <section
      id="guestbook"
      className={styles.wall}
      aria-labelledby="guestbook-title"
    >
      <div className={styles.inner}>
        <div className={styles.header} data-reveal>
          <div>
            <span className={styles.kicker}>
              The wishes wall · signed &amp; sealed
            </span>
            <h2 id="guestbook-title" className={styles.title}>
              Leave a wish for
              <em>Lathika Aunty.</em>
            </h2>
          </div>
          <p className={styles.lead}>
            Every good teacher collects thank-yous the way a mathematician
            collects proofs. Add yours to the wall — it stays on this device, so
            the next student who opens it will read it too.
          </p>
        </div>

        <div className={styles.layout}>
          <form className={styles.form} onSubmit={submit} data-reveal>
            <span className={styles.formKicker}>
              <span aria-hidden="true">✎</span>
              Sign the wall
            </span>

            <label className={styles.field}>
              <span>Your name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={40}
                placeholder="e.g. Amara"
                autoComplete="name"
              />
            </label>

            <label className={styles.field}>
              <span>Class or note (optional)</span>
              <input
                type="text"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                maxLength={40}
                placeholder="Grade 10 · B"
              />
            </label>

            <label className={styles.field}>
              <span>Your wish</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                maxLength={240}
                rows={5}
                placeholder="Something you would like Aunty to know…"
              />
              <span
                className={`${styles.counter} ${
                  remaining < 40 ? styles.counterLow : ""
                }`}
              >
                {remaining} characters left
              </span>
            </label>

            <button type="submit" className={styles.submit}>
              Pin my wish
              <span aria-hidden="true">↗</span>
            </button>

            <p className={styles.status} role="status" aria-live="polite">
              {status || "Your wish is saved in this browser only."}
            </p>
          </form>

          <div className={styles.board}>
            <div className={styles.boardTop} data-reveal>
              <span className={styles.boardCount}>{countLabel}</span>
              <span className={styles.boardNote}>
                Signed by the students of Grade 10
              </span>
            </div>

            <ul className={styles.wishGrid}>
              {wishes.map((wish, index) => (
                <li
                  key={wish.id}
                  className={styles.wishCard}
                  data-reveal
                  style={{ "--tilt": `${(index % 3) - 1}deg` }}
                >
                  <span className={styles.corner} aria-hidden="true">
                    {wish.symbol}
                  </span>
                  <p className={styles.wishText}>{wish.message}</p>
                  <div className={styles.wishMeta}>
                    <span className={styles.wishName}>{wish.name}</span>
                    <span className={styles.wishRole}>{wish.role}</span>
                  </div>
                  <div className={styles.wishFoot}>
                    <span className={styles.wishDate}>
                      {formatDate(wish.createdAt)}
                    </span>
                    <button
                      type="button"
                      className={styles.remove}
                      onClick={() => removeWish(wish.id)}
                      aria-label={`Remove the wish signed by ${wish.name}`}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {wishes.length === 0 && (
              <p className={styles.empty}>
                The wall is blank for now. Be the first to sign it — every wall
                starts with one wish.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

WishesWall.propTypes = {
  onCelebrate: PropTypes.func,
};
