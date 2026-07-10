// Playwright locators already auto-wait and auto-retry actionability,
// so no explicit-wait/click-via-JS workarounds are needed here
// (unlike the Selenium BasePage this mirrors).
class BasePage {
  constructor(page) {
    this.page = page;
  }
}

module.exports = { BasePage };
