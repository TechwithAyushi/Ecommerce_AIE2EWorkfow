const { test, expect } = require('../../../fixtures/checkout-fixtures');

test.describe('SauceDemo Checkout Workflow', () => {
  test('TC-09 Finish confirms order and clears the cart', async ({
    loginPage,
    productsPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
    orderConfirmationPage,
  }) => {
    // 1. Complete checkout with a populated cart and valid information.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.addToCart('sauce-labs-backpack');
    await productsPage.openCart();
    await cartPage.checkout();
    await checkoutInformationPage.fill('Taylor', 'QA', '90210');
    await checkoutInformationPage.continue();
    await checkoutOverviewPage.finish();

    // 2. Verify confirmation, return home, and check that the cart was cleared.
    await expect(orderConfirmationPage.page).toHaveURL(/checkout-complete\.html$/);
    await expect(orderConfirmationPage.title).toHaveText('Checkout: Complete!');
    await expect(orderConfirmationPage.successMessage).toBeVisible();
    await expect(orderConfirmationPage.backHomeButton).toBeVisible();
    await orderConfirmationPage.backHome();
    await productsPage.openCart();
    await expect(cartPage.items).toHaveCount(0);
    await expect(productsPage.cartBadge).toHaveCount(0);
  });
});
