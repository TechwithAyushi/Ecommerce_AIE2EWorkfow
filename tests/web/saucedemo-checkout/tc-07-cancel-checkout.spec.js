const { test, expect } = require('../../../fixtures/checkout-fixtures');

test.describe('SauceDemo Checkout Workflow', () => {
  test('TC-07 Cancel checkout preserves cart and does not submit order', async ({
    loginPage,
    productsPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
  }) => {
    // 1. Add an item and cancel from checkout information.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.addToCart('sauce-labs-backpack');
    await productsPage.openCart();
    await cartPage.checkout();
    await checkoutInformationPage.cancel();
    await expect(cartPage.page).toHaveURL(/cart\.html$/);
    await expect(cartPage.items).toHaveCount(1);

    // 2. Continue to Overview and cancel without finishing the order.
    await cartPage.checkout();
    await checkoutInformationPage.fill('Taylor', 'QA', '90210');
    await checkoutInformationPage.continue();
    await checkoutOverviewPage.cancel();
    await expect(productsPage.page).toHaveURL(/inventory\.html$/);
    await expect(productsPage.cartBadge).toHaveText('1');
  });
});
