import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/landing-page');
  await page.getByRole('link', { name: 'Sign Up' }).click();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('iamplaywright');
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('test@gmail.com');
  await page.getByRole('textbox', { name: 'Email Address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill('kohei0099');
  await page.getByRole('textbox', { name: 'Password', exact: true }).press('Tab');
  await page.locator('div').filter({ hasText: /^Password$/ }).getByLabel('Show password').press('Tab');
  await page.getByRole('textbox', { name: 'Confirm Password' }).fill('kohei0099');
  await page.getByText('Select your role').click();
  await page.getByText('Student').click();
  await page.getByRole('button', { name: 'Create Account' }).click();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('iamplaywright');
  await page.getByRole('textbox', { name: 'Username' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('kohei0099');
  await page.getByRole('button', { name: 'Sign In' }).click();
});