import { Module } from "https://qrframe.kylezhe.ng/utils.js";

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
  "Marker color": {
    type: "color",
    default: "#111111",
  },
  "Inner color": {
    type: "color",
    default: "#111111",
  },
  "Marker style": {
    type: "select",
    options: [
      "Classic",
      "Rounded",
      "Target",
      "Brackets",
      "Cutout",
      "Double",
      "Diamond",
      "Dots",
      "Leaf",
      "Frame",
    ],
    default: "Target",
  },
  "Data shape": {
    type: "select",
    options: [
      "Square",
      "Rounded",
      "Circle",
      "Diamond",
      "Squircle",
      "Capsule",
      "Plus",
      "Spark",
    ],
    default: "Rounded",
  },
  "Data size": {
    type: "number",
    min: 0.4,
    max: 1,
    step: 0.01,
    default: 0.82,
  },
};

const fmt = (n) => n.toFixed(2).replace(/.00$/, "");

export function renderSVG(qr, params) {
  const rowLen = qr.version * 4 + 17;
  const margin = params["Margin"];
  const size = rowLen + 2 * margin;
  const dataSize = params["Data size"];
  const offset = (1 - dataSize) / 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-margin} ${-margin} ${size} ${size}">`;
  svg += `<rect x="${-margin}" y="${-margin}" width="${size}" height="${size}" fill="${params["Background"]}"/>`;

  svg += `<path fill="${params["Foreground"]}" d="`;
  for (let y = 0; y < rowLen; y++) {
    for (let x = 0; x < rowLen; x++) {
      const module = qr.matrix[y * rowLen + x];
      if (!(module & Module.ON) || module & Module.FINDER) continue;
      svg += dataModule(x + offset, y + offset, dataSize, params["Data shape"]);
    }
  }
  svg += `"/>`;

  for (const [x, y] of [
    [0, 0],
    [rowLen - 7, 0],
    [0, rowLen - 7],
  ]) {
    svg += marker(x, y, params);
  }

  svg += `</svg>`;
  return svg;
}

function dataModule(x, y, size, shape) {
  const mid = size / 2;
  if (shape === "Circle") {
    const r = mid;
    return `M${fmt(x + r)},${fmt(y)}a${fmt(r)},${fmt(r)} 0,0,0 0,${fmt(size)}a${fmt(r)},${fmt(r)} 0,0,0 0,-${fmt(size)}`;
  }
  if (shape === "Diamond") {
    return `M${fmt(x + mid)},${fmt(y)}l${fmt(mid)},${fmt(mid)}l-${fmt(mid)},${fmt(mid)}l-${fmt(mid)},-${fmt(mid)}z`;
  }
  if (shape === "Squircle") {
    return squircle(x, y, size, size * 0.23);
  }
  if (shape === "Capsule") {
    return roundedRect(x, y + size * 0.18, size, size * 0.32, true);
  }
  if (shape === "Plus") {
    const arm = size * 0.32;
    const pad = (size - arm) / 2;
    return `M${fmt(x + pad)},${fmt(y)}h${fmt(arm)}v${fmt(pad)}h${fmt(pad)}v${fmt(arm)}h-${fmt(pad)}v${fmt(pad)}h-${fmt(arm)}v-${fmt(pad)}h-${fmt(pad)}v-${fmt(arm)}h${fmt(pad)}z`;
  }
  if (shape === "Spark") {
    return `M${fmt(x + mid)},${fmt(y)}c${fmt(size * 0.12)},${fmt(size * 0.28)} ${fmt(size * 0.22)},${fmt(size * 0.38)} ${fmt(mid)},${fmt(mid)}c-${fmt(size * 0.28)},${fmt(size * 0.12)} -${fmt(size * 0.38)},${fmt(size * 0.22)} -${fmt(mid)},${fmt(size)}c-${fmt(size * 0.12)},-${fmt(size * 0.28)} -${fmt(size * 0.22)},-${fmt(size * 0.38)} -${fmt(size)},-${fmt(mid)}c${fmt(size * 0.28)},-${fmt(size * 0.12)} ${fmt(size * 0.38)},-${fmt(size * 0.22)} ${fmt(mid)},-${fmt(mid)}`;
  }
  if (shape === "Rounded") {
    return roundedRect(x, y, size, size * 0.28, true);
  }
  return `M${fmt(x)},${fmt(y)}h${fmt(size)}v${fmt(size)}h-${fmt(size)}z`;
}

function marker(x, y, params) {
  const fg = params["Marker color"];
  const inner = params["Inner color"];
  switch (params["Marker style"]) {
    case "Rounded":
      return `<g fill="${fg}">${roundedRect(x, y, 7, 1.4, true)}${roundedRect(x + 1, y + 1, 5, 1, false)}</g><g fill="${inner}">${roundedRect(x + 2, y + 2, 3, 0.65, true)}</g>`;
    case "Target":
      return `<g fill="none" stroke="${fg}" stroke-width="1"><circle cx="${x + 3.5}" cy="${y + 3.5}" r="3"/><circle cx="${x + 3.5}" cy="${y + 3.5}" r="2"/></g><circle cx="${x + 3.5}" cy="${y + 3.5}" r="1.1" fill="${inner}"/>`;
    case "Brackets":
      return `<path fill="none" stroke="${fg}" stroke-width="1" stroke-linecap="round" d="M${x},${y + 2.5}v-2.5h2.5M${x + 4.5},${y}h2.5v2.5M${x + 7},${y + 4.5}v2.5h-2.5M${x + 2.5},${y + 7}h-2.5v-2.5"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx=".7" fill="${inner}"/>`;
    case "Cutout":
      return `<path fill="${fg}" d="M${x},${y}h7v2h-5v5h-2zM${x + 5},${y}h2v7h-7v-2h5z"/><rect x="${x + 2.35}" y="${y + 2.35}" width="2.3" height="2.3" fill="${inner}"/>`;
    case "Double":
      return `<path fill="none" stroke="${fg}" stroke-width=".85" d="M${x + 0.5},${y + 0.5}h6v6h-6zM${x + 1.65},${y + 1.65}h3.7v3.7h-3.7z"/><rect x="${x + 2.5}" y="${y + 2.5}" width="2" height="2" fill="${inner}"/>`;
    case "Diamond":
      return `<path fill="${fg}" d="M${x + 3.5},${y}l3.5,3.5l-3.5,3.5l-3.5,-3.5zM${x + 3.5},${y + 1.35}l-2.15,2.15l2.15,2.15l2.15,-2.15z"/><path fill="${inner}" d="M${x + 3.5},${y + 2.35}l1.15,1.15l-1.15,1.15l-1.15,-1.15z"/>`;
    case "Dots":
      return `<g fill="${fg}"><circle cx="${x + 0.5}" cy="${y + 0.5}" r=".5"/><circle cx="${x + 3.5}" cy="${y + 0.5}" r=".5"/><circle cx="${x + 6.5}" cy="${y + 0.5}" r=".5"/><circle cx="${x + 0.5}" cy="${y + 3.5}" r=".5"/><circle cx="${x + 6.5}" cy="${y + 3.5}" r=".5"/><circle cx="${x + 0.5}" cy="${y + 6.5}" r=".5"/><circle cx="${x + 3.5}" cy="${y + 6.5}" r=".5"/><circle cx="${x + 6.5}" cy="${y + 6.5}" r=".5"/></g><circle cx="${x + 3.5}" cy="${y + 3.5}" r="1.35" fill="${inner}"/>`;
    case "Leaf":
      return `<path fill="${fg}" d="M${x},${y + 3.5}c0,-2 1.5,-3.5 3.5,-3.5h3.5v3.5c0,2 -1.5,3.5 -3.5,3.5h-3.5zM${x + 1.4},${y + 3.5}c0,1.2 0.9,2.1 2.1,2.1c1.2,0 2.1,-0.9 2.1,-2.1c0,-1.2 -0.9,-2.1 -2.1,-2.1c-1.2,0 -2.1,0.9 -2.1,2.1z"/><circle cx="${x + 3.5}" cy="${y + 3.5}" r="1" fill="${inner}"/>`;
    case "Frame":
      return `<path fill="none" stroke="${fg}" stroke-width="1.05" d="M${x + 0.5},${y + 0.5}h6v6h-6z"/><path fill="none" stroke="${fg}" stroke-width=".55" d="M${x + 1.75},${y + 1.75}h3.5v3.5h-3.5z"/><rect x="${x + 2.55}" y="${y + 2.55}" width="1.9" height="1.9" rx=".25" fill="${inner}"/>`;
    default:
      return `<path fill="${fg}" d="M${x},${y}h7v7h-7zM${x + 1},${y + 1}v5h5v-5z"/><path fill="${inner}" d="M${x + 2},${y + 2}h3v3h-3z"/>`;
  }
}

function squircle(x, y, width, handle) {
  const half = fmt(width / 2);
  const h = fmt(handle);
  const hInv = fmt(width / 2 - handle);
  return `M${fmt(x + width / 2)},${fmt(y)}c${h},0 ${half},${hInv} ${half},${half}s-${hInv},${half} -${half},${half}s-${half},-${hInv} -${half},-${half}s${hInv},-${half} ${half},-${half}`;
}

function roundedRect(x, y, width, radius, cw) {
  const r = Math.min(radius, width / 2);
  if (r <= 0) {
    return cw
      ? `M${fmt(x)},${fmt(y)}h${fmt(width)}v${fmt(width)}h-${fmt(width)}z`
      : `M${fmt(x)},${fmt(y)}v${fmt(width)}h${fmt(width)}v-${fmt(width)}z`;
  }
  const side = fmt(width - 2 * r);
  const rr = fmt(r);
  return cw
    ? `M${fmt(x + r)},${fmt(y)}h${side}a${rr},${rr} 0,0,1 ${rr},${rr}v${side}a${rr},${rr} 0,0,1 -${rr},${rr}h-${side}a${rr},${rr} 0,0,1 -${rr},-${rr}v-${side}a${rr},${rr} 0,0,1 ${rr},-${rr}`
    : `M${fmt(x + r)},${fmt(y)}a${rr},${rr} 0,0,0 -${rr},${rr}v${side}a${rr},${rr} 0,0,0 ${rr},${rr}h${side}a${rr},${rr} 0,0,0 ${rr},-${rr}v-${side}a${rr},${rr} 0,0,0 -${rr},-${rr}`;
}
