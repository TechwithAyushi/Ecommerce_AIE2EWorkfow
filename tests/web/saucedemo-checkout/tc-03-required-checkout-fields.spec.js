const { test, expect } = require('../../../fixtures/checkout-fixtures');

test.describe('SauceDemo Checkout Workflow', () => {
  test('TC-03 Checkout form reports each missing required field', async ({
    loginPage,
    productsPage,
    cartPage,
    checkoutInformationPage,
  }) => {
    // 1. Log in, add an item, and open checkout information.
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await productsPage.addToCart('sauce-labs-backpack');
    await productsPage.openCart();
    await cartPage.checkout();

    // 2. Submit empty fields and then progressively enter required information.
    await checkoutInformationPage.continue();
    await expect(checkoutInformationPage.errorMessage).toHaveText('Error: First Name is required');
    await expect(checkoutInformationPage.page).toHaveURL(/checkout-step-one\.html$/);

    await checkoutInformationPage.firstName.fill('Taylor');
    await checkoutInformationPage.continue();
    await expect(checkoutInformationPage.errorMessage).toHaveText('Error: Last Name is required');

    await checkoutInformationPage.lastName.fill('QA');
    await checkoutInformationPage.continue();
    await expect(checkoutInformationPage.errorMessage).toHaveText('Error: Postal Code is required');
    await expect(checkoutInformationPage.page).toHaveURL(/checkout-step-one\.html$/);
  });
});
