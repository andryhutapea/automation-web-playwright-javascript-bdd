const { expect } = require('@playwright/test');
const { Given, When, Then } = require('./bdd');
const { USERS } = require('../../config');

// Shared across cart.feature and session.feature backgrounds.
Given('user is logged in as {string} and on the inventory page', async ({ loginPage, inventoryPage }, username) => {
  const user = Object.values(USERS).find((u) => u.username === username);
  await loginPage.open();
  await loginPage.login(user.username, user.password);
  await expect(inventoryPage.pageTitle).toHaveText('Products');
});

// Shared: used as both Given and When across cart/checkout/session
// (Cucumber keywords are cosmetic — one registration matches any keyword).
When('user adds the product {string} to the cart', async ({ inventoryPage }, productSlug) => {
  await inventoryPage.addToCart(productSlug);
});

// Shared: cart.feature (When) and checkout.feature background (Given).
When('user opens the cart page', async ({ inventoryPage }) => {
  await inventoryPage.goToCart();
});

// Shared: cart.feature and session.feature.
Then('the cart item count is {int}', async ({ inventoryPage }, count) => {
  if (count === 0) {
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  } else {
    await expect(inventoryPage.cartBadge).toHaveText(String(count));
  }
});

// Shared: login.feature and checkout.feature both render validation
// errors through the same [data-test="error"] element.
Then('an error message {string} is displayed', async ({ page }, errorMessage) => {
  await expect(page.locator('xpath=//*[@data-test="error"]')).toHaveText(errorMessage);
});

// Shared: session.feature (Given and When).
When('user logs out of the application', async ({ inventoryPage }) => {
  await inventoryPage.logout();
});
