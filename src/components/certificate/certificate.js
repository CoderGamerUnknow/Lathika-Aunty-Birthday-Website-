const WIDTH = 1600;
const HEIGHT = 1131;
const FALLBACK_SERIF = 'Georgia, "Times New Roman", serif';
const FALLBACK_SANS = '"Segoe UI", system-ui, sans-serif';

const drawTracked = (ctx, text, centerX, y, spacing) => {
  const characters = [...text];
  const widths = characters.map((character) => ctx.measureText(character).width);
  const total =
    widths.reduce((sum, width) => sum + width, 0) +
    spacing * Math.max(0, characters.length - 1);

  let cursor = centerX - total / 2;

  characters.forEach((character, index) => {
    ctx.fillText(character, cursor + widths[index] / 2, y);
    cursor += widths[index] + spacing;
  });
};

const wrapLines = (ctx, text, maxWidth) => {
  const words = text.split(" ");
  const lines = [];
  let line = "";

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;

    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
      return;
    }

    line = candidate;
  });

  if (line) lines.push(line);

  return lines;
};

const drawFrame = (ctx) => {
  ctx.strokeStyle = "rgba(232, 189, 120, 0.55)";
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, WIDTH - 96, HEIGHT - 96);

  ctx.strokeStyle = "rgba(232, 189, 120, 0.2)";
  ctx.lineWidth = 1;
  ctx.strokeRect(66, 66, WIDTH - 132, HEIGHT - 132);

  const corners = [
    [48, 48, 1, 1],
    [WIDTH - 48, 48, -1, 1],
    [48, HEIGHT - 48, 1, -1],
    [WIDTH - 48, HEIGHT - 48, -1, -1],
  ];

  ctx.strokeStyle = "rgba(247, 220, 164, 0.7)";
  ctx.lineWidth = 2;

  corners.forEach(([x, y, sx, sy]) => {
    ctx.beginPath();
    ctx.moveTo(x + 26 * sx, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + 26 * sy);
    ctx.stroke();
  });
};

const drawSeal = (ctx, centerX, centerY) => {
  ctx.save();
  ctx.setLineDash([4, 7]);
  ctx.strokeStyle = "rgba(232, 189, 120, 0.55)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 58, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.strokeStyle = "rgba(232, 189, 120, 0.32)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 44, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(247, 220, 164, 0.94)";
  ctx.font = `italic 300 46px "Fraunces", ${FALLBACK_SERIF}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("∞", centerX, centerY + 3);
  ctx.textBaseline = "alphabetic";
};

export function renderCertificate(canvas, rawName) {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const name = rawName.trim() || "A student of Grade 10";
  const date = new Date().toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  // Background wash
  const background = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  background.addColorStop(0, "#101a2e");
  background.addColorStop(0.55, "#0a1020");
  background.addColorStop(1, "#060a13");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Soft glow
  const glow = ctx.createRadialGradient(1310, 210, 0, 1310, 210, 520);
  glow.addColorStop(0, "rgba(232, 189, 120, 0.14)");
  glow.addColorStop(1, "rgba(232, 189, 120, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const roseGlow = ctx.createRadialGradient(250, 980, 0, 250, 980, 460);
  roseGlow.addColorStop(0, "rgba(233, 166, 184, 0.09)");
  roseGlow.addColorStop(1, "rgba(233, 166, 184, 0)");
  ctx.fillStyle = roseGlow;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Graph paper
  ctx.strokeStyle = "rgba(232, 189, 120, 0.045)";
  ctx.lineWidth = 1;

  for (let x = 100; x < WIDTH - 80; x += 58) {
    ctx.beginPath();
    ctx.moveTo(x, 80);
    ctx.lineTo(x, HEIGHT - 80);
    ctx.stroke();
  }

  for (let y = 100; y < HEIGHT - 80; y += 58) {
    ctx.beginPath();
    ctx.moveTo(80, y);
    ctx.lineTo(WIDTH - 80, y);
    ctx.stroke();
  }

  // Decorative orbit
  ctx.strokeStyle = "rgba(232, 189, 120, 0.12)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(1360, 200, 250, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(1360, 200, 298, 0, Math.PI * 2);
  ctx.stroke();

  drawFrame(ctx);

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // Eyebrow
  ctx.fillStyle = "rgba(232, 189, 120, 0.8)";
  ctx.font = `500 19px "Space Grotesk", ${FALLBACK_SANS}`;
  drawTracked(ctx, "A MATHEMATICAL BIRTHDAY TRIBUTE", WIDTH / 2, 172, 7);

  // Title
  ctx.fillStyle = "rgba(248, 243, 232, 0.92)";
  ctx.font = `300 62px "Fraunces", ${FALLBACK_SERIF}`;
  ctx.fillText("Certificate of", WIDTH / 2, 294);

  const titleFill = ctx.createLinearGradient(430, 0, 1170, 0);
  titleFill.addColorStop(0, "#fff7e2");
  titleFill.addColorStop(0.45, "#f4d293");
  titleFill.addColorStop(1, "#edb3c2");
  ctx.fillStyle = titleFill;
  ctx.font = `italic 300 106px "Fraunces", ${FALLBACK_SERIF}`;
  ctx.fillText("Infinite Gratitude", WIDTH / 2, 414);

  // Divider
  ctx.strokeStyle = "rgba(232, 189, 120, 0.42)";
  ctx.lineWidth = 1;
  [1, -1].forEach((direction) => {
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2 + direction * 34, 466);
    ctx.lineTo(WIDTH / 2 + direction * 240, 466);
    ctx.stroke();
  });
  ctx.fillStyle = "rgba(247, 220, 164, 0.85)";
  ctx.font = `italic 300 30px "Fraunces", ${FALLBACK_SERIF}`;
  ctx.fillText("∞", WIDTH / 2, 477);

  // Presented to
  ctx.fillStyle = "rgba(203, 208, 221, 0.6)";
  ctx.font = `500 18px "Space Grotesk", ${FALLBACK_SANS}`;
  drawTracked(ctx, "THIS IS PRESENTED TO", WIDTH / 2, 552, 6);

  // Recipient
  let nameSize = 104;
  ctx.font = `italic 300 ${nameSize}px "Fraunces", ${FALLBACK_SERIF}`;

  while (ctx.measureText(name).width > 1120 && nameSize > 42) {
    nameSize -= 2;
    ctx.font = `italic 300 ${nameSize}px "Fraunces", ${FALLBACK_SERIF}`;
  }

  const nameFill = ctx.createLinearGradient(380, 0, 1220, 0);
  nameFill.addColorStop(0, "#fff7e2");
  nameFill.addColorStop(0.55, "#f4d293");
  nameFill.addColorStop(1, "#edb3c2");
  ctx.fillStyle = nameFill;
  ctx.fillText(name, WIDTH / 2, 676);

  const underline = ctx.createLinearGradient(520, 0, 1080, 0);
  underline.addColorStop(0, "rgba(232, 189, 120, 0)");
  underline.addColorStop(0.5, "rgba(232, 189, 120, 0.6)");
  underline.addColorStop(1, "rgba(232, 189, 120, 0)");
  ctx.strokeStyle = underline;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(520, 714);
  ctx.lineTo(1080, 714);
  ctx.stroke();

  // Citation
  const citation =
    "For a year of patience, second chances, and mathematics taught with warmth. In every lesson you proved the theorem no syllabus contains: that kindness is the only proof which never asks for a reason.";

  ctx.fillStyle = "rgba(203, 208, 221, 0.72)";
  ctx.font = `300 27px "Space Grotesk", ${FALLBACK_SANS}`;
  const lines = wrapLines(ctx, citation, 1010);
  lines.forEach((line, index) => {
    ctx.fillText(line, WIDTH / 2, 790 + index * 42);
  });

  // Signatures
  const signatureY = 1018;

  ctx.strokeStyle = "rgba(232, 189, 120, 0.35)";
  ctx.lineWidth = 1;
  [
    [300, 604],
    [996, 1300],
  ].forEach(([start, end]) => {
    ctx.beginPath();
    ctx.moveTo(start, signatureY);
    ctx.lineTo(end, signatureY);
    ctx.stroke();
  });

  ctx.fillStyle = "rgba(247, 220, 164, 0.72)";
  ctx.font = `italic 300 30px "Fraunces", ${FALLBACK_SERIF}`;
  ctx.fillText("the students", 452, signatureY - 14);
  ctx.fillText(date, 1148, signatureY - 14);

  ctx.fillStyle = "rgba(170, 177, 196, 0.55)";
  ctx.font = `500 15px "Space Grotesk", ${FALLBACK_SANS}`;
  drawTracked(ctx, "GRADE 10 · MATHEMATICS", 452, signatureY + 34, 3.4);
  drawTracked(ctx, "WITH LOVE, FROM YOUR CLASS", 1148, signatureY + 34, 3.4);

  drawSeal(ctx, WIDTH / 2, 970);

  // Signed-off note
  ctx.fillStyle = "rgba(170, 177, 196, 0.32)";
  ctx.font = `500 13px "Space Grotesk", ${FALLBACK_SANS}`;
  drawTracked(ctx, "HAPPY BIRTHDAY, LATHIKA AUNTY", WIDTH / 2, 1084, 5);
}

export const CERTIFICATE_SIZE = {
  width: WIDTH,
  height: HEIGHT,
};
