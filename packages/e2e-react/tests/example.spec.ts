import { test, expect } from '@playwright/test';
import { getIframe } from './helpers';

test.beforeEach('open page', async ({ page }) => {
  await page.goto('/');
});

test('EmbeddedChat should render', async ({ page }) => {
  const iframe = await getIframe(page);

  await expect(iframe.getByTestId('embedded-chat')).toBeVisible();
});
