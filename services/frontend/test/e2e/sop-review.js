import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("https://gradpilot.me/login");
  await page.getByRole("textbox", { name: "Email" }).click();
  await page.getByRole("textbox", { name: "Email" }).fill("rapunzel@gmail.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("asdfghjk");
  await page.getByRole("button", { name: "Log In" }).click();
  await page.getByRole("link", { name: "SOP Review" }).click();
  await page
    .getByRole("textbox", { name: "Start writing your Statement" })
    .click();
  await page
    .getByRole("textbox", { name: "Start writing your Statement" })
    .fill(
      "Paragraph example 3: hyperactivity\nSeveral years ago, Channel 4, \
      together with Jo Frost (perhaps better known as Supernanny) conducted an experiment. \
      Forty children, aged six, were invited to a party and divided into two halves. \
      One half was given typical sugary party foods. The other half ate sugar-free foods. \
      The parents were unaware as to which group their child was in. No artificial colourings \
      or flavourings commonly found in sweets were present. Artificial colourings and flavourings have \
      already been linked to hyperactivity. Many parents believe that sugar consumption causes hyperactivity \
      in their children. 'Sugar highs' are often blamed for rowdiness or excitability, but is sugar guilty of \
      causing hyperactivity or is it simply a case of 'normal' childhood behaviour? As the children ran about \
      and enjoyed the party, the parents were asked whether they believed their own child had been given sugar. \
      The majority believed they had. As the children sat down to watch a magic show, many parents changed their minds. \
      They could not accept that their child was capable of sitting still after consuming sugary foods. \
      The experiment suggested that there was no link between hyperactivity and sugar intake. \
      The children were naturally excited because they were at a party.\n\n"
    );
  await page.getByRole("button", { name: "Review My SOP" }).click();
});
