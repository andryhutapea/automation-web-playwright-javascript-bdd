const { expect } = require('@playwright/test');
const { When, Then } = require('./bdd');

When('user removes the product {string} from the cart', async ({ inventoryPage }, productSlug) => {
  await inventoryPage.removeFromCart(productSlug);
});

Then('the product {string} is displayed on the cart page', async ({ cartPage }, productName) => {
  await expect(cartPage.itemNames).toContainText([productName]);
});
