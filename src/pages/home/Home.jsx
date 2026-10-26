import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CelebrationCanvas } from "../../components/CelebrationCanvas";
import { GeometricCake } from "../../components/GeometricCake";
import { DEMOS } from "../../components/math/demos";
import { DemoIcon } from "../../components/math/DemoIcon";
import { MathStage } from "../../components/math/MathStage";
import { useScrollContext } from "../../components/ScrollContext";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { animateHomeIn } from "./animations";
import styles from "./home.module.scss";

gsap.registerPlugin(ScrollTrigger);

const THEOREMS = [
  {
    label: "Theorem 01",
    symbol: "∞",
    title: "The Kindness Theorem",
    given: "a room full of different minds.",
    prove: "every one of them belongs.",
    body: "You noticed the quiet ones, encouraged the unsure ones, and made room for every kind of mind. In your class, no one was ever a remainder.",
    proof: "observed every single day",
  },
  {
    label: "Lemma 02",
    symbol: "Σ",
    title: "The Infinite Patience Lemma",
    given: "one very confusing problem.",
    prove: "no question is ever a bother.",
    body: "You explained it again — and again — with the same warmth every time, until the confusion gave way to that wonderful little spark of understanding.",
    proof: "proven without a single sigh",
  },
  {
    label: "Corollary 03",
    symbol: "△",
    title: "The Confidence Corollary",
    given: "a student who doubted themselves.",
    prove: "they were capable all along.",
    body: "You believed in us long before we could prove it ourselves. That belief became the compass we still use to find our way.",
    proof: "and forever true",
  },
];

export function Home() {
  const pageRef = useRef(null);
  const confettiRef = useRef(null);
  const { wrapperRef, lenis } = useScrollContext();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeDemo, setActiveDemo] = useState("trigonometry");
  const [demoClicks, setDemoClicks] = useState({});

  useLayoutEffect(() => {
    if (prefersReducedMotion) {
      ScrollTrigger.refresh();
      return undefined;
    }

    const page = pageRef.current;
    const scroller = wrapperRef.current;

    if (!page || !scroller) return undefined;

    const context = gsap.context(() => {
      const select = gsap.utils.selector(page);

      animateHomeIn(page);

      select("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          autoAlpha: 0,
          y: 36,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            scroller,
            start: "top 88%",
            once: true,
          },
        });
      });
    }, page);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => context.revert();
  }, [prefersReducedMotion, wrapperRef]);

  useEffect(() => {
    let cancelled = false;

    const refresh = () => {
      if (cancelled) return;
      lenis?.resize();
      ScrollTrigger.refresh();
    };

    const frame = requestAnimationFrame(refresh);

    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh).catch(() => {});
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [lenis]);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    const timeout = window.setTimeout(() => {
      confettiRef.current?.burst({
        x:
          window.innerWidth > 1100
            ? window.innerWidth * 0.7
            : window.innerWidth * 0.5,
        y: window.innerHeight * 0.34,
        count: 54,
        spread: 1.05,
      });
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [prefersReducedMotion]);

  const selectDemo = (id, event) => {
    setActiveDemo(id);
    setDemoClicks((previous) => ({
      ...previous,
      [id]: (previous[id] || 0) + 1,
    }));

    const button = event?.currentTarget;
    const rect = button?.getBoundingClientRect();
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) return;

    confettiRef.current?.burst({
      x: rect ? rect.left + rect.width / 2 : window.innerWidth * 0.68,
      y: rect ? rect.top + rect.height * 0.4 : window.innerHeight * 0.4,
      count: 26,
      spread: 0.82,
    });
  };

  const scrollTo = (id) => {
    const target = document.getElementById(id);

    if (!target) return;

    if (lenis) {
      lenis.scrollTo(target, { offset: -88, duration: 1.3 });
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <main className={styles.home} ref={pageRef}>
        <section
          id="celebration"
          className={styles.hero}
          aria-labelledby="hero-title"
        >
          <div className={styles.heroHalo} aria-hidden="true" />

          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow} data-hero-eyebrow>
                <span className={styles.eyebrowStar} aria-hidden="true">
                  ✦
                </span>
                A birthday tribute · Grade 10 mathematics
              </span>

              <h1 id="hero-title" className={styles.title}>
                <span className={styles.titleMask}>
                  <span className={styles.titleLine} data-hero-line>
                    Happy Birthday
                  </span>
                </span>
                <span className={styles.titleMask}>
                  <span
                    className={`${styles.titleLine} ${styles.titleName}`}
                    data-hero-line
                  >
                    to Lathika Aunty!
                  </span>
                </span>
              </h1>

              <p className={styles.lead} data-hero-lead>
                Today we celebrate the teacher who makes every equation feel
                like a story, every classroom feel like home, and every one of
                us feel like family.
              </p>

              <div className={styles.heroMeta}>
                <span className={styles.chip} data-hero-chip>
                  <span className={styles.chipSymbol} aria-hidden="true">
                    ∞
                  </span>
                  A teacher who cares like family
                </span>
                <span className={styles.chip} data-hero-chip>
                  <span className={styles.chipSymbol} aria-hidden="true">
                    π
                  </span>
                  Grade 10 · Mathematics
                </span>
              </div>

              <div className={styles.heroActions} data-hero-scroll>
                <button
                  type="button"
                  className={styles.scrollCue}
                  onClick={() => scrollTo("tribute")}
                >
                  Read the tribute
                  <span className={styles.scrollIcon} aria-hidden="true">
                    ↓
                  </span>
                </button>
                <span className={styles.heroSignature}>
                  with love, from your students
                </span>
              </div>
            </div>

            <div className={styles.lab} data-hero-lab>
              <div className={styles.labBar}>
                <div className={styles.labHeading}>
                  <span className={styles.labKicker}>
                    The little theorem lab
                  </span>
                  <span className={styles.labNote}>
                    Click a theorem · watch mathematics celebrate you
                  </span>
                </div>
                <span className={styles.liveBadge}>
                  <span className={styles.liveDot} aria-hidden="true" />
                  Interactive
                </span>
              </div>

              <div
                className={styles.tabs}
                role="group"
                aria-label="Choose an interactive mathematics demonstration"
              >
                {DEMOS.map((demo) => {
                  const isActive = activeDemo === demo.id;

                  return (
                    <button
                      key={demo.id}
                      type="button"
                      id={`demo-tab-${demo.id}`}
                      className={`${styles.tab} ${
                        isActive ? styles.tabActive : ""
                      }`}
                      onClick={(event) => selectDemo(demo.id, event)}
                      aria-pressed={isActive}
                      aria-controls="math-stage"
                      aria-label={`Explore ${demo.label}`}
                    >
                      <span className={styles.tabIcon}>
                        <DemoIcon id={demo.id} />
                      </span>
                      <span className={styles.tabLabel}>{demo.tab}</span>
                    </button>
                  );
                })}
              </div>

              <MathStage
                active={activeDemo}
                step={demoClicks[activeDemo] || 0}
              />
            </div>
          </div>
        </section>

        <section
          id="tribute"
          className={styles.tribute}
          aria-labelledby="tribute-title"
        >
          <div className={styles.sectionInner}>
            <div className={styles.tributeHeader}>
              <div>
                <span className={styles.sectionKicker} data-reveal>
                  The tribute · given &amp; proven
                </span>
                <h2
                  id="tribute-title"
                  className={styles.sectionTitle}
                  data-reveal
                >
                  Some lessons live
                  <em>beyond the syllabus.</em>
                </h2>
              </div>
              <p className={styles.sectionLead} data-reveal>
                You taught us mathematics, yes. But you also taught us patience,
                generosity, and the courage to try again. Those are the lessons
                that stayed.
              </p>
            </div>

            <div className={styles.theoremGrid}>
              {THEOREMS.map((theorem) => (
                <article
                  key={theorem.label}
                  className={styles.theoremCard}
                  data-reveal
                >
                  <span className={styles.cardSymbol} aria-hidden="true">
                    {theorem.symbol}
                  </span>
                  <div className={styles.cardTop}>
                    <span className={styles.cardLabel}>{theorem.label}</span>
                    <span className={styles.cardStatus}>Proven</span>
                  </div>
                  <h3 className={styles.cardTitle}>{theorem.title}</h3>
                  <p className={styles.cardStatement}>
                    <span>Given:</span> {theorem.given}
                    <br />
                    <span>To prove:</span> {theorem.prove}
                  </p>
                  <p className={styles.cardBody}>{theorem.body}</p>
                  <div className={styles.cardProof}>
                    <span className={styles.qed}>Q.E.D.</span>
                    <span>{theorem.proof}</span>
                  </div>
                </article>
              ))}
            </div>

            <figure className={styles.tributeQuote} data-reveal>
              <span className={styles.quoteMark} aria-hidden="true">
                “
              </span>
              <blockquote>
                You never made us feel like a problem to be solved. You made us
                feel like people worth believing in.
              </blockquote>
              <figcaption>— the students of Grade 10</figcaption>
            </figure>
          </div>
        </section>

        <section
          id="wishes"
          className={styles.wishes}
          aria-labelledby="wishes-title"
        >
          <div className={styles.sectionInner}>
            <div className={styles.wishesCard} data-reveal>
              <div className={styles.wishesCopy}>
                <span className={styles.sectionKicker}>
                  With love &amp; gratitude
                </span>
                <h2 id="wishes-title" className={styles.wishesTitle}>
                  A birthday wish,
                  <em>from all of us.</em>
                </h2>

                <div className={styles.wishBody}>
                  <p className={styles.salutation}>Dear Lathika Aunty,</p>
                  <p>
                    Happy Birthday! Today we celebrate you — a teacher who leads
                    with patience, teaches with kindness, and cares for each of
                    us as if we were her own children.
                  </p>
                  <p>
                    Thank you for making mathematics feel less like a set of
                    rules and more like a language of possibility. Thank you for
                    the extra explanations, the encouraging smiles, and the
                    quiet faith you place in us every day.
                  </p>
                  <p>
                    May this year bring you as much warmth, joy, and love as you
                    give to everyone around you. We hope your day is full of
                    laughter, your year full of health, and your life full of
                    the kind of happiness that never needs to be solved for.
                  </p>
                </div>

                <p className={styles.wishSignature}>
                  With all our love,
                  <span>Your Grade 10 students</span>
                </p>
              </div>

              <div className={styles.wishesArt}>
                <span className={styles.artLabel}>
                  A birthday set · three candles
                </span>
                <GeometricCake />
                <p className={styles.artCaption}>
                  One candle for every wish we have for you.
                </p>
                <span className={styles.artEquation} aria-hidden="true">
                  gratitude = ∞
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <CelebrationCanvas ref={confettiRef} />
    </>
  );
}
