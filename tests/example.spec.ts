import { test, expect } from '@playwright/test';

test('トップページが表示される', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Vite + React + TS');
}); 