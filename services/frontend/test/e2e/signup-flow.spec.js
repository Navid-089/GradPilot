import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  // await page.goto("http://gradpilot.me/signup");
  await page.goto("http://localhost:3000/signup");
  await page.getByRole("button", { name: "Close notification" }).click();
  await page.getByRole("textbox", { name: "Full Name *" }).fill("Test user");
  await page.getByRole("textbox", { name: "Email *" }).click();
  // await page.getByRole("textbox", { name: "Email *" }).fill("test@gmail.com");
  const randomId = Math.floor(Math.random() * 100000);
  const email = `test${randomId}@gmail.com`;
  await page.getByRole("textbox", { name: "Email *" }).fill(email);
  await page.getByRole("spinbutton", { name: "GPA" }).click();
  await page.getByRole("spinbutton", { name: "GPA" }).fill("3.46");
  await page.getByPlaceholder("GRE").click();
  await page.getByPlaceholder("GRE").fill("310");
  await page.getByPlaceholder("IELTS").click();
  await page.getByPlaceholder("IELTS").fill("8");
  await page.getByPlaceholder("TOFEL").click();
  await page.getByPlaceholder("TOFEL").fill("110");
  await page.getByRole("textbox", { name: "Target Majors" }).click();
  await page.getByRole("textbox", { name: "Target Majors" }).fill("AI");
  await page.getByRole("textbox", { name: "Target Majors" }).press("Enter");
  await page.getByRole("textbox", { name: "Target Majors" }).click();
  await page.getByRole("textbox", { name: "Target Majors" }).fill("HCI");
  await page
    .getByRole("textbox", { name: "Target Majors" })
    .press("Shift+Enter");
  await page.getByRole("textbox", { name: "Target Majors" }).fill("CS");
  await page
    .getByRole("textbox", { name: "Target Majors" })
    .press("Shift+Enter");
  await page.getByRole("textbox", { name: "Research Interests" }).click();
  await page.getByRole("textbox", { name: "Research Interests" }).fill("HCI");
  await page
    .getByRole("textbox", { name: "Research Interests" })
    .press("Shift+Enter");
  await page.getByRole("textbox", { name: "Research Interests" }).fill("AI");
  await page
    .getByRole("textbox", { name: "Research Interests" })
    .press("Shift+Enter");
  await page.getByRole("spinbutton", { name: "Deadline Year" }).click();
  await page.getByRole("spinbutton", { name: "Deadline Year" }).fill("2026");
  await page.getByRole("checkbox", { name: "Canada" }).check();
  await page.getByRole("checkbox", { name: "United Kingdom" }).check();
  await page.getByRole("textbox", { name: "Password *", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Password *", exact: true })
    .fill("asdfghjk");
  await page.getByRole("textbox", { name: "Confirm Password *" }).click();
  await page
    .getByRole("textbox", { name: "Confirm Password *" })
    .fill("asdfghjk");
  await page.getByRole("button", { name: "Sign Up" }).click();
  // await page.goto("http://gradpilot.me/signup");
  await page.goto("http://localhost:3000/signup");
  await page.getByRole("textbox", { name: "Email *" }).click();
  await page
    .getByRole("textbox", { name: "Email *" })
    .press("ControlOrMeta+ArrowLeft");
  await page.getByRole("textbox", { name: "Email *" }).press("ArrowRight");
  await page.getByRole("textbox", { name: "Email *" }).press("ArrowRight");
  await page.getByRole("textbox", { name: "Email *" }).press("ArrowRight");
  await page.getByRole("textbox", { name: "Email *" }).press("ArrowRight");
  await page
    .getByRole("textbox", { name: "Email *" })
    .fill("testuser@gmail.com");
  await page.getByRole("checkbox", { name: "Canada" }).uncheck();
  await page.getByRole("button", { name: "Sign Up" }).click();
  // await page.goto("http://gradpilot.me/signup");
  await page.goto("http://localhost:3000/signup");
  await page.getByRole("link", { name: "Log in" }).click();
  // await page.goto("http://gradpilot.me/signup");
  await page.goto("http://localhost:3000/signup");
  await page.getByRole("button", { name: "Sign Up" }).click();
});
