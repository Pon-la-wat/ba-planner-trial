import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const html = readFileSync(resolve(__dirname, "..", "index.html"), "utf8");
const doc = new DOMParser().parseFromString(html, "text/html");

describe("index.html", () => {
  it("[EX-1] shows the words Hello World and nothing else", () => {
    expect(doc.body.textContent?.replace(/\s+/g, " ").trim()).toBe("Hello World");
    const extras = doc.body.querySelectorAll(
      "button, img, nav, a, input, svg, video, canvas, iframe, script",
    );
    expect(extras).toHaveLength(0);
  });

  it("[EX-2] needs nothing from the internet to display", () => {
    expect(doc.querySelectorAll("script, link, img, iframe, source")).toHaveLength(0);
    expect(html).not.toMatch(/https?:\/\//i);
  });
});
