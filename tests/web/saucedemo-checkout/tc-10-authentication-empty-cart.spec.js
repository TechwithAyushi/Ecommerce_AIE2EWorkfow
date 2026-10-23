const { test, expect } = require('../../../fixtures/checkout-fixtures');

test.describe('SauceDemo Checkout Workflow', () => {
  test('TC-10 Authentication protects checkout and empty cart cannot be completed', async ({
    page,
    loginPage,
    productsPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
  }) => {
    // 1. Confirm signed-out users cannot directly access Cart or checkout information.
    await page.goto('https://www.saucedemo.com/cart.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await page.goto('https://www.saucedemo.com/checkout-step-one.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // 2. Sign in with an empty cart and inspect checkout without submitting an empty order.
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory\.html$/);
    await productsPage.openCart();
    await expect(cartPage.items).toHaveCount(0);
    await cartPage.checkout();
    await checkoutInformationPage.fill('Taylor', 'QA', '90210');
    await checkoutInformationPage.continue();
    await expect(checkoutOverviewPage.page).toHaveURL(/checkout-step-two\.html$/);
    await expect(checkoutOverviewPage.items).toHaveCount(0);
    await expect(checkoutOverviewPage.total).toHaveText('Total: $0.00');

    // The app currently enables Finish for an empty order; preserve this acceptance check.
    await expect(checkoutOverviewPage.finishButton).toBeDisabled();
  });
});
