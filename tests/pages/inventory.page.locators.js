// SauceDemo inventory (product listing) page
module.exports = {
  pageTitle: (page) => page.locator('xpath=//*[@class="title"]'),
  cartBadge: (page) => page.locator('xpath=//*[@class="shopping_cart_badge"]'),
  cartLink: (page) => page.locator('xpath=//*[@data-test="shopping-cart-link"]'),
  sortDropdown: (page) => page.locator('xpath=//*[@data-test="product-sort-container"]'),
  productNames: (page) => page.locator('xpath=//*[@class="inventory_item_name"]'),
  productPrices: (page) => page.locator('xpath=//*[@class="inventory_item_price"]'),

  menuButton: (page) => page.locator('id=react-burger-menu-btn'),
  logoutLink: (page) => page.locator('id=logout_sidebar_link'),
  resetLink: (page) => page.locator('id=reset_sidebar_link'),

  addToCartButton: (page, productSlug) => page.locator(`xpath=//*[@data-test="add-to-cart-${productSlug}"]`),
  removeButton: (page, productSlug) => page.locator(`xpath=//*[@data-test="remove-${productSlug}"]`),
};
