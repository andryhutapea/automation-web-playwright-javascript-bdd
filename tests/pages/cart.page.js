const { BasePage } = require('./base.page');
const locators = require('./cart.page.locators');

class CartPage extends BasePage {
  get cartItems() {
    return locators.cartItems(this.page);
  }

  get itemNames() {
    return locators.itemNames(this.page);
  }

  async getItemNames() {
    return locators.itemNames(this.page).allTextContents();
  }

  async removeItem(productSlug) {
    await locators.removeButton(this.page, productSlug).click();
  }

  async checkout() {
    await locators.checkoutButton(this.page).click();
  }

  async continueShopping() {
    await locators.continueShoppingButton(this.page).click();
  }
}

module.exports = { CartPage };
