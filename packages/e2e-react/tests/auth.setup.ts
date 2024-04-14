import { test as setup, expect } from '@playwright/test';
import { AUTH_FILE_PATH, TEST_PASSWORD, TEST_USERNAME } from '../constants';

setup('authenticate', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('join-button').click();

  await page.getByTestId('login-email').fill(TEST_USERNAME);
  await page.getByTestId('login-password').fill(TEST_PASSWORD);

  await page.getByTestId('login-button').click();
  await expect(page.getByTestId('join-button')).toBeHidden();

  await page.context().storageState({ path: AUTH_FILE_PATH });
});
