const { test, expect } = require("@playwright/test");
const { PageManager } = require("../pages/PageManager");
//JSON -> string > javascript object
const dataSet = JSON.parse(
  JSON.stringify(require("../utils/placeOrderTestData.json"))
);

for (const data of dataSet) {
  test(`Client App login with ${data.username}`, async ({ page }) => {
    const poManager = new PageManager(page);

    const products = page.locator(".card-body");
    const loginPage = poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.validLogin(data.username, data.password);
    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProductAddCart(data.productName);
    await dashboardPage.navigateToCart();

    const cartPage = poManager.getCartPage();
    await cartPage.VerifyProductIsDisplayed(data.productName);
    await cartPage.Checkout();

    const ordersReviewPage = poManager.getOrdersReviewPage();
    await ordersReviewPage.searchCountryAndSelect("pol", "Poland");
    const orderId = await ordersReviewPage.SubmitAndGetOrderId();
    console.log(orderId);
    await dashboardPage.navigateToOrders();
    const ordersHistoryPage = poManager.getOrdersHistoryPage();
    await ordersHistoryPage.searchOrderAndSelect(orderId);
    expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();

    //Zara Coat 4
  });
}
