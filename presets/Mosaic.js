import { Module, getSeededRand } from "https://qrframe.kylezhe.ng/utils.js";

export const paramsSchema = {
  Margin: {
    type: "number",
    min: 0,
    max: 10,
    step: 0.1,
    default: 2,
  },
  Style: {
    type: "select",
    options: ["Mosaic", "Lego", "Collage"],
  },
  Background: {
    type: "color",
    default: "#f8fafc",
  },
  "Tile colors": {
    type: "array",
    resizable: true,
    props: {
      type: "color",
    },
    default: ["#111827", "#ef4444", "#f59e0b", "#2563eb", "#16a34a"],
  },
  Grout: {
    type: "color",
    default: "#e5e7eb",
  },
  "Tile gap": {
    type: "number",
    min: 0,
    max: 0.45,
    step: 0.01,
    default: 0.08,
  },
  "Color drift": {
    type: "number",
    min: 0,
    max: 1,
    step: 0.01,
    default: 0.28,
  },
  Seed: {
    type: "number",
    min: 1,
    max: 100,
    default: 3,
  },
};

const fmt = (n) => n.toFixed(2).replace(/.00$/, "");

export function renderSVG(qr, params) {
  const rand = getSeededRand(params["Seed"]);
  const rowLen = qr.version * 4 + 17;
  const margin = params["Margin"];
  const size = rowLen + 2 * margin;
  const gap = params["Tile gap"];
  const colors = params["Tile colors"].length
    ? params["Tile colors"]
    : ["#111827"];

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-margin} ${-margin} ${size} ${size}">`;
  svg += `<rect x="${-margin}" y="${-margin}" width="${size}" height="${size}" fill="${params["Background"]}"/>`;
  svg += `<rect x="0" y="0" width="${rowLen}" height="${rowLen}" fill="${params["Grout"]}" opacity=".55"/>`;

  for (let y = 0; y < rowLen; y++) {
    for (let x = 0; x < rowLen; x++) {
      const module = qr.matrix[y * rowLen + x];
      if (!(module & Module.ON)) continue;
      const finder = module & Module.FINDER;
      const color = finder
        ? colors[0]
        : driftColor(pick(colors, rand), params["Color drift"], rand);
      if (finder) {
        svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}"/>`;
        continue;
      }

      if (params["Style"] === "Lego") {
        svg += lego(x, y, color, gap);
      } else if (params["Style"] === "Collage") {
        const angle = fmt((rand() - 0.5) * 16);
        const scale = fmt(1 - gap + rand() * 0.12);
        svg += `<rect x="${fmt(x + gap / 2)}" y="${fmt(y + gap / 2)}" width="${scale}" height="${scale}" rx=".08" fill="${color}" transform="rotate(${angle} ${fmt(x + 0.5)} ${fmt(y + 0.5)})" opacity="${fmt(0.84 + rand() * 0.16)}"/>`;
      } else {
        svg += `<rect x="${fmt(x + gap / 2)}" y="${fmt(y + gap / 2)}" width="${fmt(1 - gap)}" height="${fmt(1 - gap)}" fill="${color}" opacity="${fmt(0.86 + rand() * 0.14)}"/>`;
      }
    }
  }

  svg += `</svg>`;
  return svg;
}

function lego(x, y, color, gap) {
  const inset = gap / 2;
  const size = 1 - gap;
  return `<g fill="${color}"><rect x="${fmt(x + inset)}" y="${fmt(y + inset)}" width="${fmt(size)}" height="${fmt(size)}" rx=".16"/><circle cx="${fmt(x + 0.5)}" cy="${fmt(y + 0.42)}" r="${fmt(size * 0.22)}" fill="#fff" opacity=".28"/><circle cx="${fmt(x + 0.5)}" cy="${fmt(y + 0.48)}" r="${fmt(size * 0.2)}"/></g>`;
}

function pick(items, rand) {
  return items[Math.floor(rand() * items.length)];
}

function driftColor(hex, amount, rand) {
  const value = hex.replace("#", "");
  if (value.length !== 6) return hex;
  const shift = () => Math.round((rand() - 0.5) * 80 * amount);
  const r = clamp(parseInt(value.slice(0, 2), 16) + shift());
  const g = clamp(parseInt(value.slice(2, 4), 16) + shift());
  const b = clamp(parseInt(value.slice(4, 6), 16) + shift());
  return `#${hex2(r)}${hex2(g)}${hex2(b)}`;
}

function clamp(n) {
  return Math.max(0, Math.min(255, n));
}

function hex2(n) {
  return n.toString(16).padStart(2, "0");
}
