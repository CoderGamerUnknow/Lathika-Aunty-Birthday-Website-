export const TAU = Math.PI * 2;

export const polar = (cx, cy, radius, angle) => ({
  x: cx + radius * Math.cos(angle),
  y: cy - radius * Math.sin(angle),
});

export const describeArc = (cx, cy, radius, startAngle, endAngle) => {
  const start = polar(cx, cy, radius, startAngle);
  const end = polar(cx, cy, radius, endAngle);
  const delta = endAngle - startAngle;
  const largeArc = Math.abs(delta) > Math.PI ? 1 : 0;
  const sweep = delta >= 0 ? 0 : 1;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
};

export const regularPolygonVertices = (cx, cy, radius, sides) =>
  Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + (index * TAU) / sides;
    return {
      ...polar(cx, cy, radius, angle),
      angle,
    };
  });

export const pointsToString = (points) =>
  points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");

export const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max);

export const formatDegrees = (radians) => {
  const degrees = (radians * 180) / Math.PI;
  return ((degrees % 360) + 360) % 360;
};
