import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import styles from "./CelebrationCanvas.module.scss";

const COLORS = [
  "#f7dca4",
  "#e8bd78",
  "#e9a6b8",
  "#8ed8ca",
  "#f8f3e8",
  "#d2a96a",
];

const SYMBOLS = ["π", "θ", "∞", "√", "Σ", "Δ", "×", "÷", "≠", "∈", "△"];

const randomBetween = (min, max) => min + Math.random() * (max - min);
const pick = (items) => items[Math.floor(Math.random() * items.length)];

export const CelebrationCanvas = forwardRef(function CelebrationCanvas(
  _props,
  ref
) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const frameRef = useRef(0);
  const runningRef = useRef(false);
  const lastFrameRef = useRef(0);
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });
  const burstRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      dimensionsRef.current = { width, height, dpr };
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawParticle = (particle) => {
      const progress = Math.min(1, particle.life / particle.maxLife);
      const alpha =
        particle.opacity *
        (progress > 0.82 ? (1 - progress) / 0.18 : progress / 0.16);

      context.save();
      context.globalAlpha = Math.max(0, Math.min(1, alpha));
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);
      context.fillStyle = particle.color;

      if (particle.kind === "symbol") {
        context.font = `600 ${particle.size}px "Space Grotesk", sans-serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(particle.symbol, 0, 0);
      } else if (particle.kind === "circle") {
        context.beginPath();
        context.arc(0, 0, particle.size * 0.28, 0, Math.PI * 2);
        context.fill();
      } else if (particle.kind === "diamond") {
        const size = particle.size * 0.36;
        context.beginPath();
        context.moveTo(0, -size);
        context.lineTo(size, 0);
        context.lineTo(0, size);
        context.lineTo(-size, 0);
        context.closePath();
        context.fill();
      } else {
        context.fillRect(
          -particle.size * 0.24,
          -particle.size * 0.5,
          particle.size * 0.48,
          particle.size
        );
      }

      context.restore();
    };

    const render = (time) => {
      const { width, height, dpr } = dimensionsRef.current;
      const delta = Math.min(34, time - lastFrameRef.current || 16.67);
      const scale = delta / 16.67;
      lastFrameRef.current = time;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      const activeParticles = [];

      particlesRef.current.forEach((particle) => {
        particle.life -= delta;
        particle.vy += particle.gravity * scale;
        particle.vx *= 0.994;
        particle.vy *= 0.996;
        particle.x += particle.vx * scale;
        particle.y += particle.vy * scale;
        particle.rotation += particle.spin * scale;

        if (particle.life > 0 && particle.y < height + 60) {
          drawParticle(particle);
          activeParticles.push(particle);
        }
      });

      particlesRef.current = activeParticles;

      if (activeParticles.length > 0) {
        frameRef.current = requestAnimationFrame(render);
      } else {
        runningRef.current = false;
        context.clearRect(0, 0, width, height);
      }
    };

    const start = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      lastFrameRef.current = performance.now();
      frameRef.current = requestAnimationFrame(render);
    };

    const burst = ({
      x = window.innerWidth * 0.62,
      y = window.innerHeight * 0.36,
      count = 34,
      spread = 1,
    } = {}) => {
      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !canvas
      ) {
        return;
      }

      if (dimensionsRef.current.width === 0) {
        resize();
      }

      for (let index = 0; index < count; index += 1) {
        const angle = randomBetween(-Math.PI * 0.92, -Math.PI * 0.08);
        const speed = randomBetween(3.2, 9.4) * spread;
        const kindRoll = Math.random();
        const kind =
          kindRoll < 0.18
            ? "symbol"
            : kindRoll < 0.35
              ? "circle"
              : kindRoll < 0.5
                ? "diamond"
                : "rect";

        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed * randomBetween(0.65, 1.2),
          vy: Math.sin(angle) * speed,
          gravity: randomBetween(0.12, 0.24),
          size: randomBetween(7, 16),
          color: pick(COLORS),
          rotation: randomBetween(0, Math.PI * 2),
          spin: randomBetween(-0.18, 0.18),
          maxLife: randomBetween(1250, 2400),
          life: randomBetween(1250, 2400),
          opacity: randomBetween(0.6, 0.95),
          kind,
          symbol: pick(SYMBOLS),
        });
      }

      start();
    };

    burstRef.current = burst;
    resize();
    window.addEventListener("resize", resize);
    start();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
      runningRef.current = false;
      particlesRef.current = [];
      burstRef.current = null;
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      burst: (options) => burstRef.current?.(options),
    }),
    []
  );

  return createPortal(
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      aria-hidden="true"
    />,
    document.body
  );
});
