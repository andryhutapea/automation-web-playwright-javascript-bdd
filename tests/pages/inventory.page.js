const { BasePage } = require('./base.page');
const locators = require('./inventory.page.locators');

class InventoryPage extends BasePage {
  get pageTitle() {
    return locators.pageTitle(this.page);
  }

  get cartBadge() {
    return locators.cartBadge(this.page);
  }

  async addToCart(productSlug) {
    await locators.addToCartButton(this.page, productSlug).click();
  }

  async removeFromCart(productSlug) {
    await locators.removeButton(this.page, productSlug).click();
  }

  async goToCart() {
    await locators.cartLink(this.page).click();
  }

  async sortBy(optionValue) {
    await locators.sortDropdown(this.page).selectOption(optionValue);
  }

  async getProductNames() {
    return locators.productNames(this.page).allTextContents();
  }

  async getProductPrices() {
    const texts = await locators.productPrices(this.page).allTextContents();
    return texts.map((text) => parseFloat(text.replace('$', '')));
  }

  async openMenu() {
    await locators.menuButton(this.page).click();
  }

  async logout() {
    await this.openMenu();
    await locators.logoutLink(this.page).click();
  }

  async resetAppState() {
    await this.openMenu();
    await locators.resetLink(this.page).click();
  }
}

module.exports = { InventoryPage };
