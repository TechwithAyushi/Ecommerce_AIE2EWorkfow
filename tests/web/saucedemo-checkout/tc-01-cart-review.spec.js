const { test, expect } = require('../../../fixtures/checkout-fixtures');

test.describe('SauceDemo Checkout Workflow', () => {
  test('TC-01 Cart review shows item details, unit price, quantity, and navigation controls', async ({
    loginPage,
    productsPage,
    cartPage,
  }) => {
    // 1. Log in, add Sauce Labs Backpack, and verify it is in the cart.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.addToCart('sauce-labs-backpack');
    await expect(productsPage.cartBadge).toHaveText('1');

    // 2. Open Cart and inspect the product row and available actions.
    await productsPage.openCart();
    await expect(cartPage.items).toHaveCount(1);
    const backpack = cartPage.items;
    await expect(backpack.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
    await expect(backpack.locator('.inventory_item_desc')).toContainText('Sly Pack');
    await expect(backpack.locator('.cart_quantity')).toHaveText('1');
    await expect(backpack.locator('.inventory_item_price')).toHaveText('$29.99');
    await expect(cartPage.continueShoppingButton).toBeVisible();
    await expect(cartPage.checkoutButton).toBeVisible();
  });
});
