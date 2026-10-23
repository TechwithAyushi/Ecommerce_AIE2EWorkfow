const { test: base, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/login.page');
const { ProductsPage } = require('../pages/products.page');
const { CartPage } = require('../pages/cart.page');
const { CheckoutInformationPage } = require('../pages/checkout-information.page');
const { CheckoutOverviewPage } = require('../pages/checkout-overview.page');
const { OrderConfirmationPage } = require('../pages/order-confirmation.page');

const demoPauseMs = process.env.PW_TEST_PAUSE_MS === undefined
  ? 0
  : Number(process.env.PW_TEST_PAUSE_MS);

if (!Number.isInteger(demoPauseMs) || demoPauseMs < 0) {
  throw new Error('PW_TEST_PAUSE_MS must be a non-negative integer.');
}

const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutInformationPage: async ({ page }, use) => {
    await use(new CheckoutInformationPage(page));
  },
  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page));
  },
  orderConfirmationPage: async ({ page }, use) => {
    await use(new OrderConfirmationPage(page));
  },
  clearCart: [async ({ page }, use) => {
    await use();
    if (demoPauseMs > 0 && !page.isClosed()) {
      await page.waitForTimeout(demoPauseMs);
    }
    if (!page.isClosed()) {
      await page.evaluate(() => localStorage.removeItem('cart-contents'));
    }
  }, { auto: true }],
});

module.exports = { test, expect };
