const { BasePage } = require('./base.page');
const { stepOne, stepTwo, complete } = require('./checkout.page.locators');

function parseMoney(text) {
  return parseFloat(text.split('$').pop());
}

class CheckoutStepOnePage extends BasePage {
  get errorMessage() {
    return stepOne.errorMessage(this.page);
  }

  async fillInfo(firstName, lastName, zipCode) {
    await stepOne.firstNameInput(this.page).fill(firstName);
    await stepOne.lastNameInput(this.page).fill(lastName);
    await stepOne.zipInput(this.page).fill(zipCode);
  }

  async continueCheckout() {
    await stepOne.continueButton(this.page).click();
  }

  async cancel() {
    await stepOne.cancelButton(this.page).click();
  }
}

class CheckoutStepTwoPage extends BasePage {
  async getItemTotal() {
    return parseMoney(await stepTwo.itemTotal(this.page).textContent());
  }

  async getTax() {
    return parseMoney(await stepTwo.tax(this.page).textContent());
  }

  async getTotal() {
    return parseMoney(await stepTwo.total(this.page).textContent());
  }

  async finish() {
    await stepTwo.finishButton(this.page).click();
  }

  async cancel() {
    await stepTwo.cancelButton(this.page).click();
  }
}

class CheckoutCompletePage extends BasePage {
  get completeHeader() {
    return complete.completeHeader(this.page);
  }

  async backHome() {
    await complete.backHomeButton(this.page).click();
  }
}

module.exports = { CheckoutStepOnePage, CheckoutStepTwoPage, CheckoutCompletePage };
