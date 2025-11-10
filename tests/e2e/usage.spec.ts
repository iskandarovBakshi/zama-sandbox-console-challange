import { test, expect } from "@playwright/test";
import { createApiKey, login } from "../src/common-fixtures";

test.describe("[004] Usage page functionality", async () => {
    test("Empty state", async ({ page }) => {
        await login(page);
        await page.getByRole("link", { name: "Usage" }).click();
        const emptyTableText = page.getByTestId("empty-table-text");
        await emptyTableText.scrollIntoViewIfNeeded();
        await expect(emptyTableText).toBeVisible();
        await expect(page.getByTestId("chart-data-empty-state")).toBeVisible();
    });

    test("Visible data", async ({ page }) => {
        await login(page);
        await createApiKey(page);
        await page.getByRole("link", { name: "Usage" }).click();
        const tableDataItem = page.getByTestId("paginated-data-item-row");
        await tableDataItem.nth(0).scrollIntoViewIfNeeded();
        expect(await tableDataItem.count()).toBeGreaterThan(0);
    });
});
