import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  // await page.goto("http://gradpilot.me/forgot-password");
  await page.goto("http://localhost:3000/forgot-password");
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill("rapunzel@gmail.com");
  await page.getByRole("button", { name: "Send reset instructions" }).click();
  await page.getByRole("link", { name: "Back to sign in" }).click();
});
