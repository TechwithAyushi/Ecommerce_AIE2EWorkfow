const { test, expect } = require('../../../fixtures/checkout-fixtures');
const loginData = require('../../../testdata/saucedemo-login-users.json');

for (const user of loginData.users) {
  test(`TC-11 Login and logout with ${user.username}`, async ({
    loginPage,
    productsPage,
  }) => {
    if (user.username === 'performance_glitch_user') {
      test.setTimeout(60000);
    }

    await loginPage.goto();
    await loginPage.login(user.username, loginData.password);

    if (user.loginOutcome === 'locked') {
      await expect(loginPage.errorMessage).toHaveText(user.errorMessage);
      await expect(loginPage.page).toHaveURL('https://www.saucedemo.com/');
      return;
    }

    const loginTimeout = user.username === 'performance_glitch_user' ? 45000 : undefined;
    await expect(loginPage.page).toHaveURL(/inventory\.html$/, { timeout: loginTimeout });
    await expect(productsPage.page.locator('.title')).toHaveText('Products', {
      timeout: loginTimeout,
    });

    await productsPage.logout();
    await expect(loginPage.page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.username).toBeVisible();
  });
}
