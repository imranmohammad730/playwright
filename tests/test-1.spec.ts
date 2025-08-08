import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://dashboard.kaiterra.com/login');
  await page.getByRole('textbox', { name: 'jane.doe@example.com' }).click();
  await page.getByRole('textbox', { name: 'jane.doe@example.com' }).fill('imran.muhammad@kaiterra.com');
  await page.getByRole('textbox', { name: 'jane.doe@example.com' }).press('Tab');
  await page.getByRole('textbox', { name: '••••••••••' }).fill('231996asdF!');
  await page.getByRole('checkbox', { name: 'Remember me' }).check();
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByText('Compliance').click();
  await page.getByRole('link', { name: 'heywood' }).click();
  await page.getByRole('button', { name: 'share-alt Subscribe' }).click();
  await page.getByRole('button', { name: 'check Subscribed' }).click();
  await page.getByRole('button', { name: 'Not subscribed' }).click();
});