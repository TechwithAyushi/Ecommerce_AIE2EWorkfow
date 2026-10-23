const { test, expect } = require('../../../fixtures/checkout-fixtures');

test.describe('SauceDemo Checkout Workflow', () => {
  test('TC-08 Browser Back and Forward navigation remains usable', async ({
    loginPage,
    productsPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
  }) => {
    // 1. Reach the order overview with valid customer information.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.addToCart('sauce-labs-backpack');
    await productsPage.openCart();
    await cartPage.checkout();
    await checkoutInformationPage.fill('Taylor', 'QA', '90210');
    await checkoutInformationPage.continue();
    await expect(checkoutOverviewPage.page).toHaveURL(/checkout-step-two\.html$/);

    // 2. Navigate back and forward using browser history.
    await checkoutOverviewPage.page.goBack();
    await expect(checkoutInformationPage.page).toHaveURL(/checkout-step-one\.html$/);
    await expect(productsPage.cartBadge).toHaveText('1');

    await checkoutOverviewPage.page.goForward();
    await expect(checkoutOverviewPage.page).toHaveURL(/checkout-step-two\.html$/);
    await expect(checkoutOverviewPage.items.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
  });
});
