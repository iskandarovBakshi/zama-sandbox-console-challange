import { test, expect } from "@playwright/test";
import { createApiKey, login } from "../src/common-fixtures";

test.describe("[002] API Keys Management", () => {
    test.beforeEach(async ({ page }) => {
        await login(page);
    });

    test("can create new API key", async ({ page }) => {
        await page.getByRole("link", { name: "API Keys" }).click();
        await expect(page).toHaveURL(/.*\/api-keys/);
        const apiKeyItems = await page.getByTestId("api-key-item");
        await expect(await apiKeyItems.count()).toEqual(0);
        await createApiKey(page);
        await expect(await apiKeyItems.count()).toEqual(1);
    });

    test("can revoke API key", async ({ page }) => {
        await createApiKey(page);
        await expect(page).toHaveURL(/.*\/api-keys/);
        await page.getByTestId("more-button").click();
        await page.getByTestId("revoke-button").click();
        await page.getByTestId("modal-submit-button").click();
        await expect(page.getByText("API key revoked successfully")).toBeVisible();
    });

    test("can regenerate API key", async ({ page }) => {
        await createApiKey(page);
        await expect(page).toHaveURL(/.*\/api-keys/);
        await page.getByTestId("more-button").click();
        await page.getByTestId("regenerate-button").click();
        await page.getByTestId("modal-submit-button").click();
        await expect(page.getByText("API key regenerated")).toBeVisible();
    });
});
