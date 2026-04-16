import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import fs from 'fs';
import { bypassCaptcha } from '../../utils/helper';
import { ENV } from '../../utils/env';

const loginData = JSON.parse(
  fs.readFileSync('data/loginData.json', 'utf-8')
);

const unregisteredUser = loginData[1];
const wrongPasswordUser = loginData[2];
const invalidEmailFormatUser = loginData[3];

test.describe('Login Feature', () => {

  test('TC-LG001: verify successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await bypassCaptcha(page);
    await loginPage.login(ENV.EMAIL, ENV.PASSWORD);
    await expect(page).toHaveURL(/\/customer\/cart$/);
  });

  test('TC-LG002: verify failed login with non-existent email', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const user = unregisteredUser;
    await loginPage.goto();
    await bypassCaptcha(page);
    await loginPage.login(user.email, user.password);
    await expect(loginPage.toastMessage).toHaveText("Email atau password Anda salah!")
  });

  test('TC-LG003: verify failed login with incorrect password (existing email)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const user = wrongPasswordUser; 
    await loginPage.goto();
    await bypassCaptcha(page);
    await loginPage.login(user.email, user.password);
    await expect(loginPage.toastMessage).toHaveText("Email atau password Anda salah!");
  });

  test('TC-LG004: verify failed login with empty email and password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await bypassCaptcha(page);
    await loginPage.login('', '');
    await expect(loginPage.toastMessage).toHaveText("Masukkan email dan password Anda!");
  });

  test('TC-LG005: verify failed login with empty password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const user = wrongPasswordUser;
    await loginPage.goto();
    await bypassCaptcha(page);
    await loginPage.login(user.email, '');
    await expect(loginPage.toastMessage).toHaveText("Masukkan email dan password Anda!");
  });

  test('TC-LG006: verify failed login with empty email', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const user = wrongPasswordUser;
    await loginPage.goto();
    await bypassCaptcha(page);
    await loginPage.login('', user.password);
    await expect(loginPage.toastMessage).toHaveText("Masukkan email dan password Anda!");
  });

  test('TC-LG007: verify failed login with invalid email format', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const user = invalidEmailFormatUser;
    await loginPage.goto();
    await bypassCaptcha(page);
    await loginPage.login(user.email, user.password);
    await expect(loginPage.toastMessage).toHaveText("Email atau password Anda salah!");
  });

  test('TC-LG008: verify failed login with SQL injection attempt', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await bypassCaptcha(page);
    await loginPage.login("' OR '1'='1", "' OR '1'='1");
    await expect(loginPage.toastMessage).toHaveText("Email atau password Anda salah!");
  });

  test('TC-LG009: verify failed login with XSS attempt', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await bypassCaptcha(page);
    await loginPage.login("<script>alert('XSS')</script>", "password");
    await expect(loginPage.toastMessage).toHaveText("Email atau password Anda salah!");
  });

});

