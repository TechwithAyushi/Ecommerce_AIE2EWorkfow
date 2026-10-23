const { test, expect } = require('../../../fixtures/checkout-fixtures');

test.describe('SauceDemo Checkout Workflow', () => {
  test('TC-06 Multi-item subtotal and total are calculated consistently', async ({
    loginPage,
    productsPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
  }) => {
    // 1. Add Backpack and Bike Light, then continue through checkout.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.addToCart('sauce-labs-backpack');
    await productsPage.addToCart('sauce-labs-bike-light');
    await expect(productsPage.cartBadge).toHaveText('2');
    await productsPage.openCart();
    await expect(cartPage.items).toHaveCount(2);
    await cartPage.checkout();
    await checkoutInformationPage.fill('Taylor', 'QA', '90210');
    await checkoutInformationPage.continue();

    // 2. Verify both items and the displayed calculations.
    await expect(checkoutOverviewPage.page).toHaveURL(/checkout-step-two\.html$/);
    await expect(checkoutOverviewPage.items).toHaveCount(2);
    await expect(checkoutOverviewPage.itemSubtotal).toHaveText('Item total: $39.98');
    await expect(checkoutOverviewPage.tax).toHaveText('Tax: $3.20');
    await expect(checkoutOverviewPage.total).toHaveText('Total: $43.18');
  });
});
