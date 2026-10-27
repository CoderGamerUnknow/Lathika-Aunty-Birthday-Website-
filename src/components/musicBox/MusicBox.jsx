import { useEffect, useRef, useState } from "react";
import styles from "./musicBox.module.scss";

const BEAT = 0.62;

const G4 = 392.0;
const A4 = 440.0;
const B4 = 493.88;
const C5 = 523.25;
const D5 = 587.33;
const E5 = 659.25;
const F5 = 698.46;
const G5 = 783.99;

// “Happy Birthday” — one entry per note, durations measured in beats.
const MELODY = [
  { note: G4, beats: 0.5 },
  { note: G4, beats: 0.5 },
  { note: A4, beats: 1 },
  { note: G4, beats: 1 },
  { note: C5, beats: 1 },
  { note: B4, beats: 2 },

  { note: G4, beats: 0.5 },
  { note: G4, beats: 0.5 },
  { note: A4, beats: 1 },
  { note: G4, beats: 1 },
  { note: D5, beats: 1 },
  { note: C5, beats: 2 },

  { note: G4, beats: 0.5 },
  { note: G4, beats: 0.5 },
  { note: G5, beats: 1 },
  { note: E5, beats: 1 },
  { note: C5, beats: 1 },
  { note: D5, beats: 1 },
  { note: C5, beats: 2 },

  { note: F5, beats: 0.5 },
  { note: F5, beats: 0.5 },
  { note: E5, beats: 1 },
  { note: C5, beats: 1 },
  { note: D5, beats: 1 },
  { note: C5, beats: 2 },
];

const TOTAL_BEATS = MELODY.reduce((total, item) => total + item.beats, 0);
const TOTAL_SECONDS = TOTAL_BEATS * BEAT;

const PARTIALS = [
  { type: "sine", ratio: 1, level: 1 },
  { type: "sine", ratio: 2.01, level: 0.24 },
  { type: "triangle", ratio: 3.02, level: 0.07 },
];

export function MusicBox() {
  const contextRef = useRef(null);
  const timerRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(
    () => () => {
      window.clearTimeout(timerRef.current);
      if (contextRef.current && contextRef.current.state !== "closed") {
        contextRef.current.close().catch(() => {});
      }
      contextRef.current = null;
    },
    []
  );

  const stop = () => {
    window.clearTimeout(timerRef.current);
    const context = contextRef.current;

    if (context && context.state !== "closed") {
      context.close().catch(() => {});
    }

    contextRef.current = null;
    setPlaying(false);
  };

  const play = () => {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
      setSupported(false);
      return;
    }

    stop();

    const context = new AudioContextClass();
    const master = context.createGain();
    const shimmer = context.createDelay(0.6);
    const feedback = context.createGain();
    const wet = context.createGain();

    master.gain.value = 0.16;
    shimmer.delayTime.value = 0.19;
    feedback.gain.value = 0.2;
    wet.gain.value = 0.16;

    master.connect(context.destination);
    master.connect(shimmer);
    shimmer.connect(feedback);
    feedback.connect(shimmer);
    shimmer.connect(wet);
    wet.connect(context.destination);

    const voice = (frequency, startAt, duration) => {
      const envelope = context.createGain();
      const release = Math.max(0.42, duration * 1.65);

      envelope.gain.setValueAtTime(0.0001, startAt);
      envelope.gain.exponentialRampToValueAtTime(0.42, startAt + 0.008);
      envelope.gain.exponentialRampToValueAtTime(
        0.0001,
        startAt + release
      );
      envelope.connect(master);

      PARTIALS.forEach(({ type, ratio, level }) => {
        const oscillator = context.createOscillator();
        const partialGain = context.createGain();

        oscillator.type = type;
        oscillator.frequency.value = frequency * ratio;
        partialGain.gain.value = level;

        oscillator.connect(partialGain);
        partialGain.connect(envelope);
        oscillator.start(startAt);
        oscillator.stop(startAt + release + 0.08);
      });
    };

    let cursor = context.currentTime + 0.14;

    MELODY.forEach(({ note, beats }) => {
      const duration = beats * BEAT * 0.94;
      voice(note, cursor, duration);
      cursor += beats * BEAT;
    });

    contextRef.current = context;
    setPlaying(true);

    if (context.state === "suspended") {
      context.resume().catch(() => {});
    }

    timerRef.current = window.setTimeout(
      () => setPlaying(false),
      (TOTAL_SECONDS + 2.6) * 1000
    );
  };

  const toggle = () => {
    if (playing) {
      stop();
      return;
    }

    play();
  };

  if (!supported) {
    return null;
  }

  return (
    <div className={styles.dock}>
      <button
        type="button"
        className={`${styles.button} ${playing ? styles.playing : ""}`}
        onClick={toggle}
        aria-pressed={playing}
        aria-label={
          playing
            ? "Stop the birthday music box"
            : "Play the birthday music box"
        }
      >
        <span className={styles.ring} aria-hidden="true" />
        <span className={styles.bars} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>
      </button>

      <span className={styles.tooltip} aria-hidden="true">
        {playing ? "Music box · playing" : "Music box · tap to play"}
      </span>
    </div>
  );
}
