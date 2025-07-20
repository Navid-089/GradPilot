import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://gradpilot.me/login');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('rapunzel@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('asdfghjk');
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByRole('button', { name: 'Open AI Chatbot' }).click();
  await page.getByRole('textbox', { name: 'Type your question here..' }).click();
  await page.getByRole('textbox', { name: 'Type your question here..' }).fill('Help me write SOP');
  await page.getByRole('textbox', { name: 'Type your question here..' }).press('Enter');
//   await page.getByRole('button').filter({ hasText: /^$/ }).click();
//   await page.getByRole('button', { name: 'Close' }).click();
});