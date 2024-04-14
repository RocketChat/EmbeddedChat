import { test, expect } from '@playwright/test';

test.beforeEach('open page', async ({ page }) => {
  await page.goto('/');
});

test('EmbeddedChat should render', async ({ page }) => {
  await expect(page.getByTestId('embedded-chat')).toBeVisible();
});
