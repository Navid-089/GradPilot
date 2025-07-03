import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://gradpilot.me/login");
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill("rapunzel@gmail.com");
  await page.getByRole("textbox", { name: "Email" }).press("Tab");
  await page.getByRole("link", { name: "Forgot password?" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("asdfghjk");
  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page).toHaveURL(/dashboard/);
  await page.getByRole("link", { name: "Dashboard" }).click();
  await page.getByRole("link", { name: "Universities", exact: true }).click();
  await page.getByRole("link", { name: "Research" }).click();
  await page.getByRole("link", { name: "Scholarships" }).click();
  await page.getByRole("button", { name: "Open AI Chatbot" }).click();
  await page
    .getByRole("textbox", { name: "Type your question here..." })
    .click();
  await page
    .getByRole("textbox", { name: "Type your question here..." })
    .fill("Help me write SOP");
  await page.getByRole("button").filter({ hasText: /^$/ }).click();
  await page
    .getByRole("textbox", { name: "Type your question here..." })
    .click();
  await page
    .getByRole("textbox", { name: "Type your question here..." })
    .fill("help me");
  await page.getByRole("button").filter({ hasText: /^$/ }).click();
  await page.getByRole("button", { name: "Close" }).click();
  await page.getByRole("link", { name: "Dashboard" }).click();
  await page.getByRole("button", { name: "Open AI Chatbot" }).click();
  await page
    .getByRole("textbox", { name: "Type your question here..." })
    .click();
  await page
    .getByRole("textbox", { name: "Type your question here..." })
    .fill("guide me");
  await page.getByRole("button").filter({ hasText: /^$/ }).click();
  await page.getByRole("button", { name: "Close" }).click();
  await page.getByRole("button", { name: "Rapunzel Rapunzel" }).click();
  await page.getByRole("menuitem", { name: "Log out" }).click();
});
