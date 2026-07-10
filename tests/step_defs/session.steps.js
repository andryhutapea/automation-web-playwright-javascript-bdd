const { expect } = require('@playwright/test');
const { When, Then } = require('./bdd');
const { BASE_URL } = require('../../config');

When('user resets the app state via the menu', async ({ inventoryPage }) => {
  await inventoryPage.resetAppState();
});

When('user opens the inventory page directly via URL', async ({ page }) => {
  await page.goto(`${BASE_URL}inventory.html`);
});

Then('user is redirected back to the login page', async ({ loginPage }) => {
  await expect(loginPage.loginButton).toBeVisible();
});
