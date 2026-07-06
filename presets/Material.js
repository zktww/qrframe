import { Module } from "https://qrframe.kylezhe.ng/utils.js";

export const paramsSchema = {
  Margin: {
    type: "number",
    min: 0,
    max: 10,
    step: 0.1,
    default: 2,
  },
  Material: {
    type: "select",
    options: ["Glass", "Acrylic", "Emboss", "Chrome", "Paper Cut"],
  },
  Background: {
    type: "color",
    default: "#e0f2fe",
  },
  Foreground: {
    type: "color",
    default: "#0f172a",
  },
  Highlight: {
    type: "color",
    default: "#ffffff",
  },
  Shadow: {
    type: "color",
    default: "#334155",
  },
  "Module opacity": {
    type: "number",
    min: 0.25,
    max: 1,
    step: 0.01,
    default: 0.78,
  },
  "Bevel size": {
    type: "number",
    min: 0,
    max: 0.35,
    step: 0.01,
    default: 0.12,
  },
  Roundness: {
    type: "number",
    min: 0,
    max: 0.45,
    step: 0.01,
    default: 0.18,
  },
};

const fmt = (n) => n.toFixed(2).replace(/.00$/, "");

export function renderSVG(qr, params) {
  const rowLen = qr.version * 4 + 17;
  const margin = params["Margin"];
  const size = rowLen + 2 * margin;
  const filterId = `material-shadow-${qr.version}-${qr.mask}`;
  const gradientId = `material-fill-${qr.version}-${qr.mask}`;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-margin} ${-margin} ${size} ${size}">`;
  svg += `<defs>`;
  svg += `<linearGradient id="${gradientId}" x1="0" y1="0" x2="1" y2="1">`;
  svg += `<stop offset="0%" stop-color="${params["Highlight"]}" stop-opacity="${params["Material"] === "Chrome" ? 0.95 : 0.45}"/>`;
  svg += `<stop offset="45%" stop-color="${params["Foreground"]}" stop-opacity="${params["Module opacity"]}"/>`;
  svg += `<stop offset="100%" stop-color="${params["Shadow"]}" stop-opacity="${params["Material"] === "Glass" ? 0.55 : 0.9}"/>`;
  svg += `</linearGradient>`;
  svg += `<filter id="${filterId}" x="-25%" y="-25%" width="150%" height="150%">`;
  svg += `<feDropShadow dx=".18" dy=".22" stdDeviation=".16" flood-color="${params["Shadow"]}" flood-opacity=".35"/>`;
  svg += `</filter></defs>`;
  svg += `<rect x="${-margin}" y="${-margin}" width="${size}" height="${size}" fill="${params["Background"]}"/>`;

  if (params["Material"] === "Acrylic" || params["Material"] === "Glass") {
    svg += `<rect x="${-margin}" y="${-margin}" width="${size}" height="${size}" fill="${params["Highlight"]}" opacity=".22"/>`;
  }

  const fill =
    params["Material"] === "Emboss"
      ? params["Background"]
      : `url(#${gradientId})`;
  const filter =
    params["Material"] === "Paper Cut" || params["Material"] === "Emboss"
      ? ` filter="url(#${filterId})"`
      : "";
  svg += `<g${filter}>`;
  for (let y = 0; y < rowLen; y++) {
    for (let x = 0; x < rowLen; x++) {
      const module = qr.matrix[y * rowLen + x];
      if (!(module & Module.ON)) continue;
      svg += tile(x, y, module, params, fill);
    }
  }
  svg += `</g>`;
  svg += `</svg>`;
  return svg;
}

function tile(x, y, module, params, fill) {
  const finder = module & Module.FINDER;
  const radius = finder ? 0.08 : params["Roundness"];
  const bevel = params["Bevel size"];
  const base =
    params["Material"] === "Chrome"
      ? roundedRect(x + 0.03, y + 0.03, 0.94, radius, fill)
      : roundedRect(x + 0.06, y + 0.06, 0.88, radius, fill);

  if (params["Material"] === "Emboss") {
    return `${roundedRect(x + 0.08, y + 0.08, 0.84, radius, params["Background"])}<path d="M${fmt(x + 0.12)},${fmt(y + 0.88)}l${fmt(0.76)},-${fmt(0.76)}" stroke="${params["Highlight"]}" stroke-width=".08" opacity=".55"/><path d="M${fmt(x + 0.12)},${fmt(y + 0.92)}h.8v-.8" stroke="${params["Shadow"]}" stroke-width=".08" opacity=".42" fill="none"/>`;
  }

  if (params["Material"] === "Paper Cut") {
    return `${roundedRect(x + 0.04, y + 0.04, 0.9, radius, params["Foreground"])}<path d="M${fmt(x + 0.1)},${fmt(y + 0.13)}h${fmt(0.62)}" stroke="${params["Highlight"]}" stroke-width=".08" opacity=".3"/>`;
  }

  return `${base}<path d="M${fmt(x + 0.14)},${fmt(y + 0.16)}h${fmt(0.72 - bevel)}" stroke="${params["Highlight"]}" stroke-width="${fmt(0.08 + bevel / 4)}" stroke-linecap="round" opacity=".42"/>`;
}

function roundedRect(x, y, width, radius, fill) {
  const r = Math.min(radius, width / 2);
  if (r <= 0) {
    return `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(width)}" height="${fmt(width)}" fill="${fill}"/>`;
  }
  return `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(width)}" height="${fmt(width)}" rx="${fmt(r)}" fill="${fill}"/>`;
}
