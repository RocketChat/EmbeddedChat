import { test as setup, expect } from '@playwright/test';
import { getIframe } from './helpers';
import dotenv from 'dotenv';

dotenv.config();
const authFile = '.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('/');
  const iframe = await getIframe(page);

  await iframe.getByTestId('join-button').click();

  await iframe.getByTestId('login-email').fill(process.env.USERNAME || '');
  await iframe.getByTestId('login-password').fill(process.env.PASSWORD || '');

  await iframe.getByTestId('login-button').click();
  await expect(iframe.getByTestId('join-button')).toBeHidden();

  await page.context().storageState({ path: authFile });
});
