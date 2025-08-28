import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/landing-page');
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('testStudent');
  await page.getByRole('textbox', { name: 'Username' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('kohei0099');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByText('The First-Gen Empowerment GrantVeridian Foundation for Sustainable').click();
  await page.getByRole('button', { name: 'Eligibility Criteria' }).click();
  await page.getByText('Choose an option...').click();
  await page.getByRole('option', { name: 'Yes' }).locator('span').click();
  await page.getByRole('button', { name: 'Save Eligibility' }).click();
  await page.getByRole('button', { name: 'Questions' }).click();
  await page.getByRole('button', { name: 'Save Questions' }).click();
  await page.getByRole('button', { name: 'Submit Application' }).click();
  await page.getByRole('main').getByRole('button', { name: 'Submit Application' }).click();
});