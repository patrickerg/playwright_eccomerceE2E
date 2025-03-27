const { expect } = require("@playwright/test");

class OrdersReviewPage {
  constructor(page) {
    this.page = page;
    this.country = page.locator("[placeholder*='Country']");
    this.dropdown = page.locator(".ta-results");
    this.emailId = page.locator(".user__name [type='text']").first();
    this.submit = page.locator(".action__submit");
    this.orderConfirmationText = page.locator(".hero-primary");
    this.orderId = page.locator(".em-spacer-1 .ng-star-inserted");
  }
  async searchCountryAndSelect(countryCode, countryName) {
    await this.country.type(countryCode, { delay: 100 });
    await this.dropdown.waitFor();
    const optionsCount = await this.dropdown.locator("button").count();
    for (let i = 0; i < optionsCount; ++i) {
      const text = await this.dropdown.locator("button").nth(i).textContent();
      if (text.trim() === countryName) {
        await this.dropdown.locator("button").nth(i).click();
        break;
      }
    }
  }

  async VerifyEmailId(username) {
    await expect(this.emailId).toHaveText(username);
  }

  // async SubmitAndGetOrderId() {
  //   await this.submit.click();
  //   await expect(this.orderConfirmationText).toHaveText(
  //     " Thankyou for the order. "
  //   );
  //   return await this.orderId.textContent();
  // }
  async SubmitAndGetOrderId() {
    await this.submit.click();

    // Wait for the confirmation text to appear
    await this.orderConfirmationText.waitFor({
      state: "visible",
      timeout: 10000,
    });

    const confirmationText = await this.orderConfirmationText.textContent();
    expect(confirmationText.trim()).toBe("Thankyou for the order.");

    // Make sure the orderId is visible before extracting it
    await this.orderId.waitFor({ state: "visible", timeout: 10000 });

    // Extract and return the orderId as a string
    const orderIdText = await this.orderId.textContent();
    return String(orderIdText).trim(); // Ensure it's a string and remove extra spaces
  }
}
module.exports = { OrdersReviewPage };
