export const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max);

export const lerp = (start, end, amount) => start + (end - start) * amount;

export const smoothStep = (value, min, max) => {
  const t = clamp((value - min) / (max - min), 0, 1);
  return t * t * (3 - 2 * t);
};

export const invSmoothStep = (value, min, max) => {
  const t = clamp(value, 0, 1);
  const s = t === 0 || t === 1 ? t : 0.5 * (1 - Math.cos(Math.PI * t));
  return min + (max - min) * s;
};
