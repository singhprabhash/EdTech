import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
const colors = JSON.parse(readFileSync("src/config/brand-theme.json", "utf8"))
  .colors as Record<string, string>;
function luminance(hex: string) {
  const values = hex
    .slice(1)
    .match(/../g)!
    .map((c) => parseInt(c, 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (x + 0.05) / (y + 0.05);
}
it("uses the six official semantic brand colors", () => {
  expect(colors).toMatchObject({
    primary: "#0B6B3A",
    "primary-dark": "#074A28",
    accent: "#E3AE1F",
    secondary: "#1D5F8C",
    background: "#FAFAF7",
    "on-surface": "#1E2329",
  });
});
it("pairs normal text and focus colors accessibly", () => {
  for (const [foreground, background] of [
    ["primary", "background"],
    ["on-primary", "primary"],
    ["on-primary", "primary-dark"],
    ["on-surface", "background"],
    ["secondary", "background"],
    ["on-accent", "accent"],
    ["on-surface-variant", "surface-container-highest"],
    ["on-primary-container", "primary-container"],
    ["focus", "background"],
    ["focus-dark", "primary-dark"],
  ])
    expect(
      contrast(colors[foreground], colors[background]),
      `${foreground}/${background}`,
    ).toBeGreaterThanOrEqual(4.5);
});
