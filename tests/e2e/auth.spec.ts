import { test, expect } from "@playwright/test";
import { login } from "../src/common-fixtures";

test.describe("[001] Authentication flow", async () => {
    test("can login", async ({ page }) => {
        await login(page);

        await expect(page.getByTestId("username")).toBeVisible();
    });
});
