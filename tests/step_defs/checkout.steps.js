const { expect } = require('@playwright/test');
const { Given, When, Then } = require('./bdd');
const { USERS } = require('../../config');

Given('user logs in as {string}', async ({ loginPage }, username) => {
  const user = Object.values(USERS).find((u) => u.username === username);
  await loginPage.open();
  await loginPage.login(user.username, user.password);
});

Given('user clicks the checkout button', async ({ cartPage }) => {
  await cartPage.checkout();
});

When(
  'user fills in the checkout information with first name {string}, last name {string}, and zip code {string}',
  async ({ checkoutStepOnePage }, firstName, lastName, zipCode) => {
    await checkoutStepOnePage.fillInfo(firstName, lastName, zipCode);
  }
);

When('user continues to the overview page', async ({ checkoutStepOnePage }) => {
  await checkoutStepOnePage.continueCheckout();
});

When('user completes the order', async ({ checkoutStepTwoPage }) => {
  await checkoutStepTwoPage.finish();
});

Then('a confirmation {string} is displayed', async ({ checkoutCompletePage }, message) => {
  await expect(checkoutCompletePage.completeHeader).toHaveText(message);
});

Then('the total price equals the subtotal plus tax', async ({ checkoutStepTwoPage }) => {
  const itemTotal = await checkoutStepTwoPage.getItemTotal();
  const tax = await checkoutStepTwoPage.getTax();
  const total = await checkoutStepTwoPage.getTotal();
  expect(total).toBeCloseTo(itemTotal + tax, 2);
});
