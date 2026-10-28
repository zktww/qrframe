import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { ByteEncoder, Module, generateWithEncoder } from "furious-qr";
import { AlphanumericEncoder, MixedEncoder, NumericEncoder } from "furious-qr/extras/encoders";
import { Module as presetModule } from "../public/utils.js";

const utilsUrl = new URL("../public/utils.js", import.meta.url).href;
const samples = [
  new ByteEncoder("https://qc.zktww.cn/"),
  new ByteEncoder("二维码同步测试"),
  new NumericEncoder("12345678901234567890"),
  new AlphanumericEncoder("QRFRAME 2026"),
  new MixedEncoder("12345678901234567890 qrframe 中文"),
];

async function loadPreset(name) {
  const code = await readFile(new URL(`../presets/${name}.js`, import.meta.url), "utf8");
  // Use the same local utility module that the browser supplies to preset workers.
  const resolved = code.replaceAll('from "qrframe"', `from "${utilsUrl}"`);
  return import(`data:text/javascript;base64,${Buffer.from(resolved).toString("base64")}`);
}

function defaults(schema) {
  return Object.fromEntries(
    Object.entries(schema).map(([key, prop]) => [
      key,
      prop.default ??
        (prop.type === "select"
          ? prop.options[0]
          : prop.type === "file"
            ? null
            : prop.type === "boolean"
              ? false
              : prop.type === "number"
                ? (prop.min ?? 0)
                : "#000000"),
    ]),
  );
}

function validSvg(svg, context) {
  assert.match(svg, /^<svg\b/, context);
  assert.match(svg, /<\/(svg)>$/, context);
  assert.doesNotMatch(svg, /NaN|Infinity|undefined/, context);
  assert.match(svg, /<(path|rect|circle)\b/, context);
}

test("preset flags match the new QR generator's module flags", () => {
  assert.deepEqual(presetModule, Module);
});

for (const name of ["Basic", "Gradient", "Markers", "Mosaic", "Material", "Glitch"]) {
  test(`${name} renders new QR output with every select option`, async () => {
    const { renderSVG, paramsSchema } = await loadPreset(name);
    const baseParams = defaults(paramsSchema);
    const variants = [baseParams];
    for (const [key, prop] of Object.entries(paramsSchema)) {
      if (prop.type === "select") {
        for (const option of prop.options) variants.push({ ...baseParams, [key]: option });
      }
    }
    // Rounded shapes and frames take different drawing paths at zero and nonzero radii.
    if ("Roundness" in baseParams) {
      variants.push(...variants.map((params) => ({ ...params, Roundness: 0.5 })));
    }
    for (const encoder of samples) {
      for (const minVersion of [1, 7]) {
        const qr = generateWithEncoder(encoder, { minVersion, mask: 2 });
        for (const params of variants) {
          validSvg(
            await renderSVG(qr, params),
            `${name}, version ${qr.version}, ${JSON.stringify(params)}`,
          );
        }
      }
    }
    if ("Logo" in baseParams) {
      const qr = generateWithEncoder(samples[0]);
      const logo = new Blob(['<svg xmlns="http://www.w3.org/2000/svg"/>'], {
        type: "image/svg+xml",
      });
      const svg = await renderSVG(qr, { ...baseParams, Logo: logo });
      validSvg(svg, "embedded logo");
      assert.match(svg, /data:image\/svg\+xml;base64,/);
    }
  });
}
