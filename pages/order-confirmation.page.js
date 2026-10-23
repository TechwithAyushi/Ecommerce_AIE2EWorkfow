class OrderConfirmationPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title');
    this.successMessage = page.getByRole('heading', { name: 'Thank you for your order!' });
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async backHome() {
    await this.backHomeButton.click();
  }
}

module.exports = { OrderConfirmationPage };
