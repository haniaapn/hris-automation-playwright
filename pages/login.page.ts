import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly toastMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toastMessage = page.locator('#toast-container .toast-message');

    this.emailInput = page.locator('form#login-form input[name="email"]');
    this.passwordInput = page.locator('form#login-form input[name="password"]');
    this.loginButton = page.locator('#submit-button');
  }

  async goto() {
    await this.page.goto('/customer/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getToastMessage() {
  return this.toastMessage;
}
}
