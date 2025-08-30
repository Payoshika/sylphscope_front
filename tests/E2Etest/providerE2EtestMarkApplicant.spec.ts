import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5173/landing-page');
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('testProvider');
  await page.getByRole('textbox', { name: 'Username' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('kohei0099');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.locator('div').filter({ hasText: /^1 \/ 20$/ }).click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('button', { name: 'Review Application' }).click();
  await page.getByText('The Innovation Catalyst').click();
  await page.getByText('The Pioneer Innovators Fund').click();
  await page.getByText('The Pioneer Innovators Fund').click();
  await page.getByText('The First-Gen Empowerment Grant', { exact: true }).click();
  await page.locator('div').filter({ hasText: /^Not Marked$/ }).click();
  await page.locator('input[name="eval-68aef2059bddf05a74485f8c"]').click();
  await page.locator('input[name="eval-68aef2059bddf05a74485f8c"]').fill('100');
  await page.locator('textarea[name="comment-68aef2059bddf05a74485f8c"]').click();
  await page.locator('textarea[name="comment-68aef2059bddf05a74485f8c"]').fill('perfect');
  await page.locator('input[name="eval-68aef2059bddf05a74485f8d"]').click();
  await page.locator('input[name="eval-68aef2059bddf05a74485f8d"]').fill('90');
  await page.locator('input[name="eval-68aef2059bddf05a74485f8d"]').press('Tab');
  await page.locator('textarea[name="comment-68aef2059bddf05a74485f8d"]').fill('really good');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Save Evaluations' }).click();
  await page.getByRole('button', { name: 'Back to Applications' }).click();
  await page.getByText('The Innovation Catalyst').click();
  await page.getByText('The First-Gen Empowerment Grant', { exact: true }).click();
  await page.locator('div').filter({ hasText: /^Eligible$/ }).click();
});