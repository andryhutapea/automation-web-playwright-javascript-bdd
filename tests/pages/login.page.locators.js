// SauceDemo login page
module.exports = {
  usernameInput: (page) => page.locator('xpath=//*[@data-test="username"]'),
  passwordInput: (page) => page.locator('xpath=//*[@data-test="password"]'),
  loginButton: (page) => page.locator('xpath=//*[@data-test="login-button"]'),
  errorMessage: (page) => page.locator('xpath=//*[@data-test="error"]'),
};
