import { test, expect } from "@playwright/test";

test("EmbeddedChat should render", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".ec-embedded-chat")).toBeVisible();
});

test("EmbeddedChat has a title", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".ec-chat-header--channelName")).toHaveText(
    "Login to chat"
  );
});
