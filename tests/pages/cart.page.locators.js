// SauceDemo cart page
module.exports = {
  cartItems: (page) => page.locator('xpath=//*[@class="cart_item"]'),
  itemNames: (page) => page.locator('xpath=//*[@class="inventory_item_name"]'),
  checkoutButton: (page) => page.locator('xpath=//*[@data-test="checkout"]'),
  continueShoppingButton: (page) => page.locator('xpath=//*[@data-test="continue-shopping"]'),
  removeButton: (page, productSlug) => page.locator(`xpath=//*[@data-test="remove-${productSlug}"]`),
};
