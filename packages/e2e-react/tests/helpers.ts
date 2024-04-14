import { Page } from "@playwright/test";

export async function getIframe(page: Page) {
  const iframe = page.frame({ name: 'storybook-preview-iframe' });
  if (!iframe) {
    throw new Error('Could not find Storybook iframe');
  }
  return iframe;
}
