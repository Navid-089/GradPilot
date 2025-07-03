// import { test, expect } from "@playwright/test";

// test("test", async ({ page }) => {
//   await page.goto("http://localhost:3000/login");
//   await page.getByRole("textbox", { name: "Email" }).click();
//   await page.getByRole("textbox", { name: "Email" }).fill("rapunzel@gmail.com");
//   await page.getByRole("textbox", { name: "Email" }).press("Tab");
//   await page.getByRole("link", { name: "Forgot password?" }).press("Tab");
//   await page.getByRole("textbox", { name: "Password" }).fill("asdfghj");
//   await page.getByRole("button", { name: "Log In" }).click();
//   await page.getByRole("textbox", { name: "Password" }).click();
//   await page.getByRole("textbox", { name: "Password" }).fill("asdfghjj");
//   await page.getByRole("button", { name: "Log In" }).click();
//   await page.getByRole("textbox", { name: "Password" }).click();
//   await page.getByRole("textbox", { name: "Password" }).fill("asdfghj");
//   await page.getByRole("button", { name: "Log In" }).click();
//   await page.getByRole("textbox", { name: "Password" }).click();
//   await page.getByRole("textbox", { name: "Password" }).fill("");
//   await page.getByRole("button", { name: "Log In" }).click();
//   await page.getByRole("link", { name: "Forgot password?" }).click();
//   await page.getByRole("textbox", { name: "Email" }).click();
//   await page.getByRole("textbox", { name: "Email" }).fill("rapunzel@gmail.com");
//   await page.getByRole("button", { name: "Send reset instructions" }).click();
//   await page.getByRole("link", { name: "Back to sign in" }).click();
//   await page.getByRole("textbox", { name: "Email" }).click();
//   await page.getByRole("textbox", { name: "Email" }).fill("rapunzel@gmail.com");
//   await page.getByRole("textbox", { name: "Password" }).click();
//   await page.getByRole("textbox", { name: "Password" }).fill("asdfghjk");
//   await page.getByRole("button", { name: "Log In" }).click();
//   await page.getByRole("button", { name: "Open AI Chatbot" }).click();
//   await page
//     .getByRole("textbox", { name: "Type your question here..." })
//     .click();
//   await page
//     .getByRole("textbox", { name: "Type your question here..." })
//     .fill("Give me LOR advice");
//   await page
//     .getByRole("textbox", { name: "Type your question here..." })
//     .press("Enter");
//   await page.getByRole("button").filter({ hasText: /^$/ }).click();
//   await page.getByRole("button", { name: "Close" }).click();
//   await page.getByRole("link", { name: "Find Universities" }).click();
//   await page.getByRole("link", { name: "Research" }).click();
//   await page.getByRole("link", { name: "Scholarships" }).click();
//   await page.getByRole("checkbox", { name: "USA Government" }).click();
//   await page.getByRole("link", { name: "2" }).click();
//   await page.getByRole("button", { name: "New Message" }).click();
//   await page.getByRole("img", { name: "Michael Chen" }).click();
//   await page.getByRole("button", { name: "Rapunzel Rapunzel" }).click();
//   await page.getByText("Log out").click();
//   await page.getByRole("button", { name: "Get Started" }).click();
//   await page.getByRole("textbox", { name: "Full Name *" }).click();
//   await page.getByRole("textbox", { name: "Full Name *" }).fill("Eugene");
//   await page.getByRole("textbox", { name: "Email *" }).click();
//   await page.getByRole("textbox", { name: "Email *" }).fill("eugene@gmail.com");
//   await page.getByRole("spinbutton", { name: "GPA" }).click();
//   await page.getByRole("spinbutton", { name: "GPA" }).fill("3.15");
//   await page.getByPlaceholder("GRE").click();
//   await page.getByPlaceholder("GRE").fill("300");
//   await page.getByPlaceholder("IELTS").click();
//   await page.getByPlaceholder("IELTS").fill("6.5");
//   await page.getByPlaceholder("TOFEL").click();
//   await page.getByPlaceholder("TOFEL").fill("110");
//   await page.getByRole("textbox", { name: "Target Majors" }).click();
//   await page.getByRole("textbox", { name: "Target Majors" }).fill("AI");
//   await page.getByRole("textbox", { name: "Target Majors" }).press("Enter");
//   await page.getByRole("textbox", { name: "Research Interests" }).click();
//   await page
//     .getByRole("textbox", { name: "Research Interests" })
//     .fill("BioInformatics");
//   await page
//     .getByRole("textbox", { name: "Research Interests" })
//     .press("Shift+Enter");
//   await page.getByRole("spinbutton", { name: "Deadline Year" }).click();
//   await page.getByRole("spinbutton", { name: "Deadline Year" }).fill("2026");
//   await page.getByRole("checkbox", { name: "United States" }).check();
//   await page.getByRole("checkbox", { name: "Canada" }).check();
//   await page.getByRole("checkbox", { name: "Canada" }).uncheck();
//   await page.getByRole("checkbox", { name: "Australia" }).check();
//   await page.getByRole("textbox", { name: "Password *", exact: true }).click();
//   await page
//     .getByRole("textbox", { name: "Password *", exact: true })
//     .fill("asdfghjk");
//   await page.getByRole("textbox", { name: "Confirm Password *" }).click();
//   await page
//     .getByRole("textbox", { name: "Confirm Password *" })
//     .fill("asdfghjk");
//   await page.getByRole("button", { name: "Sign Up" }).click();
//   await page.getByPlaceholder("GRE").click();
//   await page.getByPlaceholder("GRE").fill("314");
//   await page.getByRole("button", { name: "Sign Up" }).click();
//   await page.getByRole("textbox", { name: "Email *" }).click();
//   await page.getByRole("textbox", { name: "Email *" }).click();
//   await page
//     .getByRole("textbox", { name: "Email *" })
//     .press("ControlOrMeta+ArrowLeft");
//   await page.getByRole("textbox", { name: "Email *" }).press("ArrowRight");
//   await page.getByRole("textbox", { name: "Email *" }).press("ArrowRight");
//   await page.getByRole("textbox", { name: "Email *" }).press("ArrowRight");
//   await page.getByRole("textbox", { name: "Email *" }).press("ArrowRight");
//   await page.getByRole("textbox", { name: "Email *" }).press("ArrowRight");
//   await page.getByRole("textbox", { name: "Email *" }).press("ArrowRight");
//   await page.getByRole("textbox", { name: "Email *" }).press("ArrowRight");
//   await page.getByRole("textbox", { name: "Email *" }).press("ArrowLeft");
//   await page.getByRole("textbox", { name: "Email *" }).press("ArrowLeft");
//   await page.getByRole("textbox", { name: "Email *" }).press("ArrowRight");
//   await page
//     .getByRole("textbox", { name: "Email *" })
//     .fill("eugene123@gmail.com");
//   await page.getByRole("button", { name: "Sign Up" }).click();
//   await page.getByRole("button", { name: "Eugene Eugene" }).click();
//   await page.locator("html").click();
// });

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

  // Go back to login page
  await page.goto("http://gradpilot.me/login");

  // Navigate to Forgot password page
  await page.getByRole("link", { name: "Forgot password?" }).click();
  await expect(page).toHaveURL(/forgot-password/); // adjust URL as per your app

  // Go back to login page
  await page.goto("http://gradpilot.me/login");

  // Navigate to Sign up page
  await page.getByRole("link", { name: "Sign up" }).click();
  await expect(page).toHaveURL(/signup/); // adjust URL as per your app
});
