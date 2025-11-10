import { test, expect } from "@playwright/test";
import { createApiKey, login } from "../src/common-fixtures";

test.describe("[003] Feature flags functionality", async () => {
    test("Toggle Advanced mode", async ({ page }) => {
        await login(page);
        await createApiKey(page);
        await page.getByRole("link", { name: "Usage" }).click();
        await page.getByTestId("feature-toggle-advanced-label").click();

        await expect(
            page.getByTestId("feature-toggle-advanced-feature-card-0"),
        ).toBeVisible();
        await expect(
            page.getByTestId("feature-toggle-advanced-feature-card-1"),
        ).toBeVisible();
    });
});
