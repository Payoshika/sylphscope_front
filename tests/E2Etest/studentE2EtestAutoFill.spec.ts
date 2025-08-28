import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/landing-page');
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('testStudent');
  await page.getByRole('textbox', { name: 'Username' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('kohei0099');
  await page.getByRole('textbox', { name: 'Password' }).press('Enter');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.locator('div').filter({ hasText: /^Veridian Foundation for Sustainable Futures$/ }).click();
  await page.getByRole('button', { name: 'Eligibility Criteria' }).click();
  await page.getByRole('button', { name: 'Questions' }).click();
});