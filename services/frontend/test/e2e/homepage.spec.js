import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://gradpilot.me/");
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.goto("http://gradpilot.me/");
  await page.getByRole("button", { name: "Get Started" }).click();
});
