// import { test, expect } from "@playwright/test";

// test("test", async ({ page }) => {
//   await page.goto("http://gradpilot.me/login");
//   await page.getByRole("textbox", { name: "Email" }).click();
//   await page.getByRole("textbox", { name: "Email" }).fill("rapunzel@gmail.com");
//   await page.getByRole("textbox", { name: "Email" }).press("Tab");
//   await page.getByRole("link", { name: "Forgot password?" }).press("Tab");
//   await page.getByRole("textbox", { name: "Password" }).fill("asdfghjk");
//   await page.getByRole("button", { name: "Log In" }).click();
// await expect(page).toHaveURL(/dashboard/);
import { test, expect } from "@playwright/test";

test("Login workflow with incorrect and correct credentials, and navigation links", async ({
  page,
}) => {
  // Go to login page
  await page.goto("http://gradpilot.me/login");

  // Try login with incorrect password
  await page.getByRole("textbox", { name: "Email" }).fill("rapunz@gmail.com");
  await page.getByRole("textbox", { name: "Password" }).fill("asdfghj"); // incorrect password
  await page.getByRole("button", { name: "Log In" }).click();

  // Optionally check for error message on incorrect login
  await expect(page.locator("text=Invalid email or password")).toBeVisible();

  // Try login with incorrect password
  await page.getByRole("textbox", { name: "Email" }).fill("rapunzel@gmail.com");
  await page.getByRole("textbox", { name: "Password" }).fill("asdfghj"); // incorrect password
  await page.getByRole("button", { name: "Log In" }).click();

  // Optionally check for error message on incorrect login
  await expect(page.locator("text=Invalid email or password")).toBeVisible();

  // Try login with correct password
  await page.getByRole("textbox", { name: "Email" }).fill("rapunzel@gmail.com");
  await page.getByRole("textbox", { name: "Password" }).fill("asdfghjk"); // correct password
  await page.getByRole("button", { name: "Log In" }).click();

  // Optionally check for successful login redirect or element
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
