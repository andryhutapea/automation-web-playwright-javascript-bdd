const { expect } = require('@playwright/test');
const { Given, When, Then } = require('./bdd');

Given('user is on the SauceDemo login page', async ({ loginPage }) => {
  await loginPage.open();
});

When('user logs in as {string} with password {string}', async ({ loginPage }, username, password) => {
  await loginPage.login(username, password);
});

Then('user is redirected to the inventory page', async ({ inventoryPage }) => {
  await expect(inventoryPage.pageTitle).toHaveText('Products');
});
