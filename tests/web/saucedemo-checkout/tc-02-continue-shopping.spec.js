const { test, expect } = require('../../../fixtures/checkout-fixtures');

test.describe('SauceDemo Checkout Workflow', () => {
  test('TC-02 Continue Shopping preserves cart contents', async ({ loginPage, productsPage, cartPage }) => {
    // 1. Log in, add Backpack, open Cart, and select Continue Shopping.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.addToCart('sauce-labs-backpack');
    await productsPage.openCart();
    await cartPage.continueShopping();
    await expect(productsPage.page).toHaveURL(/inventory\.html$/);
    await expect(productsPage.cartBadge).toHaveText('1');

    // 2. Open Cart again and verify the item is preserved.
    await productsPage.openCart();
    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.items.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
    await expect(cartPage.items.locator('.cart_quantity')).toHaveText('1');
  });
});
