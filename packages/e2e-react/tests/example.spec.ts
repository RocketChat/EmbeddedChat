import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("renders unauthenticated chat state", async ({ page }) => {
  await expect(page.locator(".ec-embedded-chat")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Login to chat" })).toBeVisible();
  await expect(page.getByRole("button", { name: "JOIN" })).toBeVisible();
  await expect(page.getByPlaceholder("Sign in to chat")).toBeDisabled();
});

test("opens login modal from join button", async ({ page }) => {
  await page.getByRole("button", { name: "JOIN" }).click();

  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  await expect(page.getByText("Email or username")).toBeVisible();
  await expect(page.getByText("Password")).toBeVisible();
});

test("shows required field validation for empty login submit", async ({ page }) => {
  await page.getByRole("button", { name: "JOIN" }).click();
  await page.getByRole("button", { name: "Login" }).last().click();

  await expect(page.getByText("This field is required")).toHaveCount(2);
});
