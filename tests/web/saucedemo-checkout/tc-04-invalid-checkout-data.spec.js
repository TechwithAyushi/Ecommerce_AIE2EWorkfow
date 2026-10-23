const { test, expect } = require('../../../fixtures/checkout-fixtures');

test.describe('SauceDemo Checkout Workflow', () => {
  test('TC-04 Invalid and boundary checkout input is validated', async ({
    loginPage,
    productsPage,
    cartPage,
    checkoutInformationPage,
  }) => {
    // 1. Reach checkout information with one item and submit invalid values.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.addToCart('sauce-labs-backpack');
    await productsPage.openCart();
    await cartPage.checkout();
    await checkoutInformationPage.fill('!!!', '###', 'abc');
    await checkoutInformationPage.continue();

    // AC5 requires rejection; the application currently accepts these values and advances.
    await expect(checkoutInformationPage.page).toHaveURL(/checkout-step-one\.html$/);
    await expect(checkoutInformationPage.errorMessage).toBeVisible();
  });
});
