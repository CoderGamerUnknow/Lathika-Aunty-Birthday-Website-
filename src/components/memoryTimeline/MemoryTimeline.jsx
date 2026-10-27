import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollContext } from "../ScrollContext";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import styles from "./memoryTimeline.module.scss";

gsap.registerPlugin(ScrollTrigger);

const MILESTONES = [
  {
    term: "Term one · the first lesson",
    title: "You learned our names first.",
    body: "Before the syllabus, before the first equation, you learned who we were — and we learned that this classroom would be different.",
    symbol: "α",
  },
  {
    term: "Term one · the hard chapter",
    title: "“I don't get it” became a beginning.",
    body: "You never sighed at a second question. You simply found a third way to explain it, and then a fourth, until it clicked.",
    symbol: "β",
  },
  {
    term: "Term two · exam week",
    title: "A mark is a measurement, not a verdict.",
    body: "You reminded us that a low score describes one Tuesday, not a whole person — then you sat with us and fixed the Tuesday.",
    symbol: "γ",
  },
  {
    term: "Term two · the back bench",
    title: "Nobody was ever a remainder.",
    body: "The quiet students, the ones who needed longer, the ones who joked through class — you made room for every single one of us.",
    symbol: "δ",
  },
  {
    term: "Today · this page",
    title: "We turned the equations around.",
    body: "Everything you taught us became a way to say thank you. Consider this the final answer, written neatly and circled twice.",
    symbol: "Ω",
  },
];

export function MemoryTimeline() {
  const sectionRef = useRef(null);
  const { wrapperRef } = useScrollContext();
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (prefersReducedMotion) return undefined;

    const section = sectionRef.current;
    const scroller = wrapperRef.current;

    if (!section || !scroller) return undefined;

    const context = gsap.context(() => {
      const fill = section.querySelector("[data-timeline-fill]");

      if (fill) {
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              scroller,
              start: "top 68%",
              end: "bottom 76%",
              scrub: 0.45,
            },
          }
        );
      }

      gsap.utils.toArray("[data-milestone]").forEach((item) => {
        gsap.from(item.querySelector("[data-milestone-card]"), {
          autoAlpha: 0,
          y: 34,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            scroller,
            start: "top 86%",
            once: true,
          },
        });

        gsap.from(item.querySelector("[data-milestone-node]"), {
          scale: 0.4,
          autoAlpha: 0,
          duration: 0.7,
          ease: "back.out(1.8)",
          scrollTrigger: {
            trigger: item,
            scroller,
            start: "top 86%",
            once: true,
          },
        });
      });
    }, section);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => context.revert();
  }, [prefersReducedMotion, wrapperRef]);

  return (
    <section
      id="memories"
      className={styles.timelineSection}
      aria-labelledby="memories-title"
      ref={sectionRef}
    >
      <div className={styles.inner}>
        <div className={styles.header} data-reveal>
          <div>
            <span className={styles.kicker}>The year · plotted point by point</span>
            <h2 id="memories-title" className={styles.title}>
              If we plotted this year,
              <em>you would be every point.</em>
            </h2>
          </div>
          <p className={styles.lead}>
            Five moments from a year of lessons — none of them in the syllabus,
            all of them on the exam that actually matters.
          </p>
        </div>

        <div className={styles.timelineBody}>
          <span className={styles.rail} aria-hidden="true">
            <span className={styles.railFill} data-timeline-fill />
          </span>

          <ol className={styles.timeline}>
            {MILESTONES.map((milestone, index) => (
              <li
                key={milestone.symbol}
                className={styles.item}
                data-milestone
              >
                <div className={styles.card} data-milestone-card>
                  <span className={styles.index} aria-hidden="true">
                    Moment {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.term}>{milestone.term}</span>
                  <h3 className={styles.cardTitle}>{milestone.title}</h3>
                  <p className={styles.body}>{milestone.body}</p>
                </div>

                <span
                  className={styles.node}
                  data-milestone-node
                  aria-hidden="true"
                >
                  <span>{milestone.symbol}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <p className={styles.footnote} data-reveal>
          <span aria-hidden="true">∴</span>
          Every point plotted. Every point loved. The graph is still rising.
        </p>
      </div>
    </section>
  );
}
