// SauceDemo checkout step one (your information) page
const stepOne = {
  firstNameInput: (page) => page.locator('xpath=//*[@data-test="firstName"]'),
  lastNameInput: (page) => page.locator('xpath=//*[@data-test="lastName"]'),
  zipInput: (page) => page.locator('xpath=//*[@data-test="postalCode"]'),
  continueButton: (page) => page.locator('xpath=//*[@data-test="continue"]'),
  cancelButton: (page) => page.locator('xpath=//*[@data-test="cancel"]'),
  errorMessage: (page) => page.locator('xpath=//*[@data-test="error"]'),
};

// SauceDemo checkout step two (overview) page
const stepTwo = {
  itemTotal: (page) => page.locator('xpath=//*[@class="summary_subtotal_label"]'),
  tax: (page) => page.locator('xpath=//*[@class="summary_tax_label"]'),
  total: (page) => page.locator('xpath=//*[@class="summary_total_label"]'),
  finishButton: (page) => page.locator('xpath=//*[@data-test="finish"]'),
  cancelButton: (page) => page.locator('xpath=//*[@data-test="cancel"]'),
};

// SauceDemo checkout complete page
const complete = {
  completeHeader: (page) => page.locator('xpath=//*[@class="complete-header"]'),
  backHomeButton: (page) => page.locator('xpath=//*[@data-test="back-to-products"]'),
};

module.exports = { stepOne, stepTwo, complete };
