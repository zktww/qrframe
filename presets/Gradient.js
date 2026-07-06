import { Module } from "https://qrframe.kylezhe.ng/utils.js";

export const paramsSchema = {
  Margin: {
    type: "number",
    min: 0,
    max: 10,
    step: 0.1,
    default: 2,
  },
  Background: {
    type: "color",
    default: "#ffffff",
  },
  "Start color": {
    type: "color",
    default: "#111827",
  },
  "End color": {
    type: "color",
    default: "#0ea5e9",
  },
  "Finder color": {
    type: "color",
    default: "#000000",
  },
  "Gradient type": {
    type: "select",
    options: ["Linear", "Radial"],
  },
  Angle: {
    type: "number",
    min: 0,
    max: 360,
    step: 1,
    default: 35,
  },
  Shape: {
    type: "select",
    options: ["Square", "Rounded", "Circle"],
    default: "Rounded",
  },
  "Pixel size": {
    type: "number",
    min: 0.4,
    max: 1,
    step: 0.01,
    default: 0.88,
  },
  Roundness: {
    type: "number",
    min: 0,
    max: 0.5,
    step: 0.01,
    default: 0.22,
  },
};

const fmt = (n) => n.toFixed(2).replace(/.00$/, "");

export function renderSVG(qr, params) {
  const rowLen = qr.version * 4 + 17;
  const margin = params["Margin"];
  const size = rowLen + 2 * margin;
  const dataSize = params["Pixel size"];
  const offset = (1 - dataSize) / 2;
  const radius = params["Shape"] === "Rounded" ? params["Roundness"] : 0;
  const gradId = `qr-gradient-${qr.version}-${qr.mask}`;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-margin} ${-margin} ${size} ${size}">`;
  svg += `<defs>`;
  if (params["Gradient type"] === "Radial") {
    svg += `<radialGradient id="${gradId}" cx="50%" cy="50%" r="70%">`;
  } else {
    svg += `<linearGradient id="${gradId}" x1="0" y1="0" x2="${rowLen}" y2="${rowLen}" gradientUnits="userSpaceOnUse" gradientTransform="rotate(${params["Angle"]} ${rowLen / 2} ${rowLen / 2})">`;
  }
  svg += `<stop offset="0%" stop-color="${params["Start color"]}"/>`;
  svg += `<stop offset="100%" stop-color="${params["End color"]}"/>`;
  svg +=
    params["Gradient type"] === "Radial"
      ? `</radialGradient>`
      : `</linearGradient>`;
  svg += `</defs>`;
  svg += `<rect x="${-margin}" y="${-margin}" width="${size}" height="${size}" fill="${params["Background"]}"/>`;

  svg += `<g fill="${params["Finder color"]}">`;
  for (const [x, y] of [
    [0, 0],
    [rowLen - 7, 0],
    [0, rowLen - 7],
  ]) {
    svg += roundedRect(x, y, 7, 1.2, true);
    svg += roundedRect(x + 1, y + 1, 5, 0.9, false);
    svg += roundedRect(x + 2, y + 2, 3, 0.6, true);
  }
  svg += `</g>`;

  svg += `<path fill="url(#${gradId})" d="`;
  for (let y = 0; y < rowLen; y++) {
    for (let x = 0; x < rowLen; x++) {
      const module = qr.matrix[y * rowLen + x];
      if (!(module & Module.ON) || module & Module.FINDER) continue;

      const px = x + offset;
      const py = y + offset;
      if (params["Shape"] === "Circle") {
        const r = dataSize / 2;
        svg += `M${fmt(px + r)},${fmt(py)}a${fmt(r)},${fmt(r)} 0,0,0 0,${fmt(dataSize)}a${fmt(r)},${fmt(r)} 0,0,0 0,-${fmt(dataSize)}`;
      } else if (radius > 0) {
        svg += roundedRect(px, py, dataSize, radius * dataSize, true);
      } else {
        svg += `M${fmt(px)},${fmt(py)}h${fmt(dataSize)}v${fmt(dataSize)}h-${fmt(dataSize)}z`;
      }
    }
  }
  svg += `"/></svg>`;
  return svg;
}

function roundedRect(x, y, width, radius, cw) {
  if (radius <= 0) {
    return cw
      ? `M${fmt(x)},${fmt(y)}h${fmt(width)}v${fmt(width)}h-${fmt(width)}z`
      : `M${fmt(x)},${fmt(y)}v${fmt(width)}h${fmt(width)}v-${fmt(width)}z`;
  }

  const r = fmt(Math.min(radius, width / 2));
  const side = fmt(width - 2 * Math.min(radius, width / 2));
  return cw
    ? `M${fmt(x + radius)},${fmt(y)}h${side}a${r},${r} 0,0,1 ${r},${r}v${side}a${r},${r} 0,0,1 -${r},${r}h-${side}a${r},${r} 0,0,1 -${r},-${r}v-${side}a${r},${r} 0,0,1 ${r},-${r}`
    : `M${fmt(x + radius)},${fmt(y)}a${r},${r} 0,0,0 -${r},${r}v${side}a${r},${r} 0,0,0 ${r},${r}h${side}a${r},${r} 0,0,0 ${r},-${r}v-${side}a${r},${r} 0,0,0 -${r},-${r}`;
}
