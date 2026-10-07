import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("[EX-1] the page shows Hello World and nothing else", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toHaveText("Hello World");
  await expect(page.getByRole("heading", { name: "Hello World" })).toBeVisible();

  // Nothing on the page can take focus, so Tab goes nowhere.
  await page.keyboard.press("Tab");
  const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
  expect(focusedTag).toBe("BODY");

  // @axe-core/playwright resolves its own copy of the Page type; the runtime object is the same.
  const results = await new AxeBuilder({ page: page as never }).analyze();
  const blocking = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(blocking).toEqual([]);
});

test("[EX-2] the page shows Hello World with no internet", async ({ page }) => {
  const external: string[] = [];
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "127.0.0.1") return route.continue();
    external.push(url.href);
    return route.abort();
  });
  await page.goto("/");
  await expect(page.locator("body")).toHaveText("Hello World");
  expect(external).toEqual([]);
});
