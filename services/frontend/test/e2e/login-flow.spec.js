import { test, expect } from "@playwright/test";

test("Login workflow with incorrect and correct credentials, and navigation links", async ({
  page,
}) => {
  // Go to login page
  // await page.goto("http://gradpilot.me/login");
  await page.goto("http://localhost:3000/login");

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
  // await page.goto("http://gradpilot.me/login");
  await page.goto("http://localhost:3000/login");

  // Navigate to Forgot password page
  await page.getByRole("link", { name: "Forgot password?" }).click();
  await expect(page).toHaveURL(/forgot-password/); // adjust URL as per your app

  // Go back to login page
  // await page.goto("http://gradpilot.me/login");
  await page.goto("http://localhost:3000/login");

  // Navigate to Sign up page
  await page.getByRole("link", { name: "Sign up" }).click();
  await expect(page).toHaveURL(/signup/); // adjust URL as per your app
});
