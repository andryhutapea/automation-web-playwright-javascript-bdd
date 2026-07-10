const { BasePage } = require('./base.page');
const locators = require('./login.page.locators');
const { BASE_URL } = require('../../config');

class LoginPage extends BasePage {
  async open() {
    await this.page.goto(BASE_URL);
  }

  async login(username, password) {
    await locators.usernameInput(this.page).fill(username);
    await locators.passwordInput(this.page).fill(password);
    await locators.loginButton(this.page).click();
  }

  get loginButton() {
    return locators.loginButton(this.page);
  }

  get errorMessage() {
    return locators.errorMessage(this.page);
  }
}

module.exports = { LoginPage };
