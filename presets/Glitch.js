import { Module, getSeededRand } from "https://qrframe.kylezhe.ng/utils.js";

export const paramsSchema = {
  Margin: {
    type: "number",
    min: 0,
    max: 10,
    step: 0.1,
    default: 2,
  },
  Foreground: {
    type: "color",
    default: "#111111",
  },
  Background: {
    type: "color",
    default: "#ffffff",
  },
  "Accent 1": {
    type: "color",
    default: "#06b6d4",
  },
  "Accent 2": {
    type: "color",
    default: "#f43f5e",
  },
  "Glitch strength": {
    type: "number",
    min: 0,
    max: 1,
    step: 0.01,
    default: 0.35,
  },
  "Slice chance": {
    type: "number",
    min: 0,
    max: 1,
    step: 0.01,
    default: 0.14,
  },
  "Ghost opacity": {
    type: "number",
    min: 0,
    max: 1,
    step: 0.01,
    default: 0.35,
  },
  "Pixel size": {
    type: "number",
    min: 0.5,
    max: 1,
    step: 0.01,
    default: 0.86,
  },
  Seed: {
    type: "number",
    min: 1,
    max: 100,
    default: 4,
  },
};

const fmt = (n) => n.toFixed(2).replace(/.00$/, "");

export function renderSVG(qr, params) {
  const rand = getSeededRand(params["Seed"]);
  const rowLen = qr.version * 4 + 17;
  const margin = params["Margin"];
  const size = rowLen + 2 * margin;
  const pixelSize = params["Pixel size"];
  const offset = (1 - pixelSize) / 2;
  const strength = params["Glitch strength"];
  const sliceChance = params["Slice chance"];

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-margin} ${-margin} ${size} ${size}">`;
  svg += `<rect x="${-margin}" y="${-margin}" width="${size}" height="${size}" fill="${params["Background"]}"/>`;
  svg += `<g opacity="${params["Ghost opacity"]}">`;
  svg += modules(
    qr,
    params["Accent 1"],
    -0.18 * strength,
    0,
    pixelSize,
    offset,
    false,
    () => 0,
  );
  svg += modules(
    qr,
    params["Accent 2"],
    0.18 * strength,
    0,
    pixelSize,
    offset,
    false,
    () => 0,
  );
  svg += `</g>`;
  svg += modules(
    qr,
    params["Foreground"],
    0,
    0,
    pixelSize,
    offset,
    true,
    () => {
      if (rand() > sliceChance) return 0;
      return (rand() - 0.5) * 1.8 * strength;
    },
  );

  for (let i = 0; i < Math.ceil(rowLen * sliceChance); i++) {
    const y = Math.floor(rand() * rowLen);
    const h = fmt(0.18 + rand() * 0.24);
    const x = fmt((rand() - 0.5) * 2.5 * strength);
    svg += `<rect x="${x}" y="${fmt(y + 0.4)}" width="${rowLen}" height="${h}" fill="${i % 2 ? params["Accent 1"] : params["Accent 2"]}" opacity="${0.16 + rand() * 0.18}"/>`;
  }

  svg += `</svg>`;
  return svg;
}

function modules(
  qr,
  fill,
  dx,
  dy,
  pixelSize,
  offset,
  stableFinders,
  rowOffset,
) {
  const rowLen = qr.version * 4 + 17;
  let svg = `<path fill="${fill}" d="`;
  for (let y = 0; y < rowLen; y++) {
    const jitter = rowOffset(y);
    for (let x = 0; x < rowLen; x++) {
      const module = qr.matrix[y * rowLen + x];
      if (!(module & Module.ON)) continue;
      const finder = module & Module.FINDER;
      if (stableFinders && finder) continue;
      if (!stableFinders && finder) continue;
      const px = fmt(x + offset + dx + jitter);
      const py = fmt(y + offset + dy);
      svg += `M${px},${py}h${fmt(pixelSize)}v${fmt(pixelSize)}h-${fmt(pixelSize)}z`;
    }
  }
  svg += `"/>`;

  if (stableFinders) {
    for (const [x, y] of [
      [0, 0],
      [rowLen - 7, 0],
      [0, rowLen - 7],
    ]) {
      svg += `<path fill="${fill}" d="M${x},${y}h7v7h-7zM${x + 1},${y + 1}v5h5v-5zM${x + 2},${y + 2}h3v3h-3z"/>`;
    }
  }

  return svg;
}
