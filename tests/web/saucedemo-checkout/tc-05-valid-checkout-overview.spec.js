const { test, expect } = require('../../../fixtures/checkout-fixtures');

test.describe('SauceDemo Checkout Workflow', () => {
  test('TC-05 Valid checkout displays complete order overview', async ({
    loginPage,
    productsPage,
    cartPage,
    checkoutInformationPage,
    checkoutOverviewPage,
  }) => {
    // 1. Add Backpack, enter valid checkout information, and continue.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.addToCart('sauce-labs-backpack');
    await productsPage.openCart();
    await cartPage.checkout();
    await checkoutInformationPage.fill('Taylor', 'QA', '90210');
    await checkoutInformationPage.continue();

    // 2. Verify the overview details, calculations, and actions.
    await expect(checkoutOverviewPage.page).toHaveURL(/checkout-step-two\.html$/);
    await expect(checkoutOverviewPage.page.locator('.title')).toHaveText('Checkout: Overview');
    await expect(checkoutOverviewPage.items.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
    await expect(checkoutOverviewPage.items.locator('.cart_quantity')).toHaveText('1');
    await expect(checkoutOverviewPage.items.locator('.inventory_item_price')).toHaveText('$29.99');
    await expect(checkoutOverviewPage.page.getByText('SauceCard #31337')).toBeVisible();
    await expect(checkoutOverviewPage.page.getByText('Free Pony Express Delivery!')).toBeVisible();
    await expect(checkoutOverviewPage.itemSubtotal).toHaveText('Item total: $29.99');
    await expect(checkoutOverviewPage.tax).toHaveText('Tax: $2.40');
    await expect(checkoutOverviewPage.total).toHaveText('Total: $32.39');
    await expect(checkoutOverviewPage.cancelButton).toBeVisible();
    await expect(checkoutOverviewPage.finishButton).toBeVisible();
  });
});
