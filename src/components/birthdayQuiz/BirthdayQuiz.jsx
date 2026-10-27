import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import styles from "./birthdayQuiz.module.scss";

const QUESTIONS = [
  {
    prompt:
      "You have asked Aunty the same doubt for the third time in one lesson. What happens next?",
    options: [
      "A deep sigh — then the board, again.",
      "The same explanation, only a little warmer.",
      "“Ask a classmate, I am busy.”",
      "A surprise test on it tomorrow.",
    ],
    answer: 1,
    note: "Every re-explanation came with the patience of the first. That is the whole theorem.",
  },
  {
    prompt: "Aunty makes a mistake while solving a sum on the board. She…",
    options: [
      "Pretends it never happened.",
      "Gives the entire class homework.",
      "Laughs kindly and turns it into a lesson.",
      "Erases the board and starts over silently.",
    ],
    answer: 2,
    note: "Mistakes were never embarrassing in her class. They were simply part of the working.",
  },
  {
    prompt: "Who does Aunty call on during a lesson?",
    options: [
      "Only the students with their hands up.",
      "Only the ones who already understand.",
      "Everyone, eventually — including the quiet ones.",
      "Nobody. She solves it herself.",
    ],
    answer: 2,
    note: "The quiet ones were never invisible. She could find a question that belonged to every student.",
  },
  {
    prompt: "Your marks are lower than you hoped. Aunty says:",
    options: [
      "“Well, mathematics is not for everyone.”",
      "“Ask your parents to explain it again.”",
      "“Try harder next time.”",
      "“A mark measures one paper, not one person. Let us fix the next one.”",
    ],
    answer: 3,
    note: "A result was a number she used to help you, never a label you had to carry.",
  },
];

const rankFor = (score) => {
  if (score === QUESTIONS.length) {
    return {
      title: "Full marks · you were paying attention",
      body: "Four for four. You knew the syllabus that was never written down — the patience, the second chances, the kindness.",
    };
  }

  if (score >= 3) {
    return {
      title: "Distinction · with a kind remark",
      body: "Nearly perfect. Aunty would still circle the one you missed, gently, and tell you it was a good try.",
    };
  }

  if (score >= 2) {
    return {
      title: "Passed with love · and a revised paper",
      body: "The questions were never really about marks. They were about noticing how someone taught us.",
    };
  }

  return {
    title: "Reassessment · but she would still let you retake it",
    body: "Not to worry. In her class, a second attempt always came with a second explanation — and the same warmth.",
  };
};

export function BirthdayQuiz({ onCelebrate }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = QUESTIONS[step];
  const answered = selected !== null;
  const isLast = step === QUESTIONS.length - 1;
  const rank = useMemo(() => rankFor(score), [score]);

  const choose = (index) => {
    if (answered) return;

    setSelected(index);

    if (index === question.answer) {
      setScore((previous) => previous + 1);
      onCelebrate?.({ count: 22, spread: 0.75 });
    }
  };

  const next = () => {
    if (!answered) return;

    if (isLast) {
      setFinished(true);
      onCelebrate?.({ count: 84, spread: 1.2 });
      return;
    }

    setStep((previous) => previous + 1);
    setSelected(null);
  };

  const restart = () => {
    setStep(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  const progress = finished
    ? 100
    : ((step + (answered ? 1 : 0)) / QUESTIONS.length) * 100;

  return (
    <section id="quiz" className={styles.quiz} aria-labelledby="quiz-title">
      <div className={styles.inner}>
        <div className={styles.header} data-reveal>
          <div>
            <span className={styles.kicker}>
              The final exam · no marks, only memories
            </span>
            <h2 id="quiz-title" className={styles.title}>
              A four-question paper
              <em>on the subject you actually taught.</em>
            </h2>
          </div>
          <p className={styles.lead}>
            The syllabus said mathematics. The exam, it turns out, is about
            noticing how someone treats the people in front of her.
          </p>
        </div>

        <div className={styles.paper} data-reveal>
          <div className={styles.paperTop}>
            <span className={styles.paperLabel}>
              Paper · gratitude / {QUESTIONS.length} questions
            </span>
            <span className={styles.paperTime}>
              {finished ? "Completed" : `Question ${step + 1} of ${QUESTIONS.length}`}
            </span>
          </div>

          <div className={styles.progress} aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>

          {finished ? (
            <div className={styles.result} aria-live="polite">
              <div className={styles.scoreRing} aria-hidden="true">
                <svg viewBox="0 0 120 120">
                  <circle
                    className={styles.scoreTrack}
                    cx="60"
                    cy="60"
                    r="52"
                    pathLength="100"
                  />
                  <circle
                    className={styles.scoreFill}
                    cx="60"
                    cy="60"
                    r="52"
                    pathLength="100"
                    style={{
                      strokeDasharray: `${(score / QUESTIONS.length) * 100} 100`,
                    }}
                  />
                </svg>
                <span className={styles.scoreValue}>
                  {score}
                  <small>/{QUESTIONS.length}</small>
                </span>
              </div>

              <span className={styles.resultKicker}>Remark from the examiner</span>
              <h3 className={styles.resultTitle}>{rank.title}</h3>
              <p className={styles.resultBody}>{rank.body}</p>

              <div className={styles.resultFoot}>
                <button type="button" className={styles.next} onClick={restart}>
                  Sit the paper again
                  <span aria-hidden="true">↺</span>
                </button>
                <span className={styles.signOff}>
                  <span aria-hidden="true">∞</span>
                  bonus marks for kindness
                </span>
              </div>
            </div>
          ) : (
            <div className={styles.question}>
              <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>
                  <span className={styles.questionNumber}>
                    Q{String(step + 1).padStart(2, "0")}
                  </span>
                  {question.prompt}
                </legend>

                <div className={styles.options}>
                  {question.options.map((option, index) => {
                    const isChosen = selected === index;
                    const isAnswer = question.answer === index;
                    const stateClass = answered
                      ? isAnswer
                        ? styles.optionCorrect
                        : isChosen
                          ? styles.optionWrong
                          : styles.optionIdle
                      : "";

                    return (
                      <button
                        key={option}
                        type="button"
                        className={`${styles.option} ${stateClass}`}
                        onClick={() => choose(index)}
                        aria-pressed={isChosen}
                        disabled={answered}
                      >
                        <span className={styles.optionKey} aria-hidden="true">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className={styles.optionText}>{option}</span>
                        {answered && isAnswer && (
                          <span className={styles.mark} aria-hidden="true">
                            ✓
                          </span>
                        )}
                        {answered && isChosen && !isAnswer && (
                          <span className={styles.mark} aria-hidden="true">
                            ✕
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className={styles.feedback} aria-live="polite">
                {answered ? (
                  <div className={styles.note}>
                    <span className={styles.noteBadge}>
                      {selected === question.answer
                        ? "Correct"
                        : "Not quite"}
                    </span>
                    <p>{question.note}</p>
                  </div>
                ) : (
                  <p className={styles.noteIdle}>
                    There is only one kind answer. Choose carefully.
                  </p>
                )}

                <button
                  type="button"
                  className={styles.next}
                  onClick={next}
                  disabled={!answered}
                >
                  {isLast ? "Hand in the paper" : "Next question"}
                  <span aria-hidden="true">{isLast ? "✓" : "→"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

BirthdayQuiz.propTypes = {
  onCelebrate: PropTypes.func,
};
