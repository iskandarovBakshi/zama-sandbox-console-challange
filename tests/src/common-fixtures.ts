import { expect, Page, test } from "@playwright/test";

export async function login(page: Page) {
    await test.step("Log in step", async () => {
        await page.goto("/");
        await page
            .getByTestId("username-input")
            .fill(`dummy-username-${crypto.randomUUID()}`);
        await page.getByTestId("password-input").fill(crypto.randomUUID());
        await page.getByTestId("login-button").click();
        await page.waitForURL("/dashboard");
        await expect(page).toHaveURL(/.*\/dashboard/);
    });
}
// requires auth.
export async function createApiKey(page: Page) {
    await test.step("Go to api-keys page and create api key step", async () => {
        const url = page.url();
        if (url !== "/dashboard/api-keys") {
            await page.getByRole("link", { name: "API Keys" }).click();
        }
        await page.getByTestId("create-api-key").click();
        await page
            .getByTestId("api-key-name-input")
            .fill(`Test API Key ${crypto.randomUUID()}`);
        await page.getByTestId("create-api-key-form-submit").click();
    });
}
