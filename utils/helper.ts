import { Page } from '@playwright/test';

export async function bypassCaptcha(page: Page) {
  await page.evaluate(() => {
    const el = document.querySelector('#recaptcha_token') as HTMLInputElement;
    if (el) el.value = 'dummy-token';
  });
}