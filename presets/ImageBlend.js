import { Module } from "https://qrframe.kylezhe.ng/utils.js";

export const paramsSchema = {
  Image: {
    type: "file",
    accept: ".jpeg, .jpg, .png, .webp",
  },
  Margin: {
    type: "number",
    min: 0,
    max: 10,
    step: 0.1,
    default: 2,
  },
  "Image opacity": {
    type: "number",
    min: 0,
    max: 1,
    step: 0.01,
    default: 0.72,
  },
  Brightness: {
    type: "number",
    min: 0.2,
    max: 2,
    step: 0.01,
    default: 1,
  },
  Contrast: {
    type: "number",
    min: 0.2,
    max: 2,
    step: 0.01,
    default: 1,
  },
  Background: {
    type: "color",
    default: "#ffffff",
  },
  "Dark modules": {
    type: "color",
    default: "#111111",
  },
  "Light modules": {
    type: "color",
    default: "#ffffff",
  },
  "Finder color": {
    type: "color",
    default: "#000000",
  },
  "Module opacity": {
    type: "number",
    min: 0.2,
    max: 1,
    step: 0.01,
    default: 0.92,
  },
  "Module size": {
    type: "number",
    min: 0.45,
    max: 1,
    step: 0.01,
    default: 0.82,
  },
  "Adaptive modules": {
    type: "boolean",
    default: true,
  },
};

export async function renderCanvas(qr, params, canvas) {
  const rowLen = qr.version * 4 + 17;
  const margin = params["Margin"];
  const unit = 18;
  const quiet = margin * unit;
  const size = Math.ceil((rowLen + 2 * margin) * unit);
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = params["Background"];
  ctx.fillRect(0, 0, size, size);

  ctx.save();
  ctx.globalAlpha = params["Image opacity"];
  ctx.filter = `brightness(${params["Brightness"]}) contrast(${params["Contrast"]})`;
  if (params["Image"]) {
    const bitmap = await createImageBitmap(params["Image"]);
    drawCover(ctx, bitmap, 0, 0, size, size);
    bitmap.close();
  } else {
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, "#f0abfc");
    gradient.addColorStop(0.5, "#38bdf8");
    gradient.addColorStop(1, "#fef08a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  ctx.restore();

  const imageData = ctx.getImageData(0, 0, size, size).data;
  ctx.globalAlpha = 0.92;
  ctx.fillStyle = params["Background"];
  for (const [x, y] of [
    [0, 0],
    [rowLen - 7, 0],
    [0, rowLen - 7],
  ]) {
    ctx.fillRect(
      Math.max(0, quiet + (x - 0.5) * unit),
      Math.max(0, quiet + (y - 0.5) * unit),
      8 * unit,
      8 * unit,
    );
  }

  ctx.globalAlpha = params["Module opacity"];
  const moduleSize = params["Module size"] * unit;
  const offset = (unit - moduleSize) / 2;

  for (let y = 0; y < rowLen; y++) {
    for (let x = 0; x < rowLen; x++) {
      const module = qr.matrix[y * rowLen + x];
      if (!(module & Module.ON)) continue;

      const px = Math.round(quiet + x * unit + unit / 2);
      const py = Math.round(quiet + y * unit + unit / 2);
      const idx = (py * size + px) * 4;
      const luminance =
        0.2126 * imageData[idx] +
        0.7152 * imageData[idx + 1] +
        0.0722 * imageData[idx + 2];
      ctx.fillStyle =
        module & Module.FINDER
          ? params["Finder color"]
          : params["Adaptive modules"] && luminance < 128
            ? params["Light modules"]
            : params["Dark modules"];

      roundedRect(
        ctx,
        quiet + x * unit + offset,
        quiet + y * unit + offset,
        moduleSize,
        module & Module.FINDER ? unit * 0.12 : moduleSize * 0.28,
      );
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function drawCover(ctx, img, x, y, width, height) {
  const scale = Math.max(width / img.width, height / img.height);
  const sw = width / scale;
  const sh = height / scale;
  const sx = (img.width - sw) / 2;
  const sy = (img.height - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, width, height);
}

function roundedRect(ctx, x, y, size, radius) {
  const r = Math.min(radius, size / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + size - r, y);
  ctx.quadraticCurveTo(x + size, y, x + size, y + r);
  ctx.lineTo(x + size, y + size - r);
  ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
  ctx.lineTo(x + r, y + size);
  ctx.quadraticCurveTo(x, y + size, x, y + size - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
}
