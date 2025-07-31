import { test, expect, Page } from '@playwright/test';

// Constants
const LOGIN_URL = 'https://the-internet.herokuapp.com/login';
const VALID_USERNAME = 'tomsmith';
const VALID_PASSWORD = 'SuperSecretPassword!';
const SUCCESS_URL = 'https://the-internet.herokuapp.com/secure';

// Page Object Model
class LoginPage {
  constructor(private page: Page) {}

  async navigateToLogin() {
    await this.page.goto(LOGIN_URL);
    await this.page.waitForLoadState('networkidle');
  }

  async fillUsername(username: string) {
    await this.page.fill('#username', username);
  }

  async fillPassword(password: string) {
    await this.page.fill('#password', password);
  }

  async clickLoginButton() {
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(1000); // Wait for message or redirect
  }

  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  async getFlashMessage() {
    const flash = this.page.locator('#flash');
    await flash.waitFor({ state: 'visible', timeout: 5000 });
    return flash.textContent();
  }

  async isLoggedIn() {
    try {
      await this.page.waitForURL(SUCCESS_URL, { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  async isOnLoginPage() {
    return this.page.url() === LOGIN_URL;
  }

  async getFlashClass() {
    const flash = this.page.locator('#flash');
    return flash.getAttribute('class');
  }
}

test.describe('Login Test Suite - Herokuapp', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
    expect(await loginPage.isOnLoginPage()).toBeTruthy();
  });

  test('TC001 - Successful login with valid credentials', async ({ page }) => {
    await loginPage.login(VALID_USERNAME, VALID_PASSWORD);
    
    expect(await loginPage.isLoggedIn()).toBeTruthy();
    expect(page.url()).toBe(SUCCESS_URL);

    const successMsg = await loginPage.getFlashMessage();
    expect(successMsg).toContain('You logged into a secure area!');
    
    const flashClass = await loginPage.getFlashClass();
    expect(flashClass).toContain('success');
  });

  ///added cmt//




  test('TC002 - Failed login with invalid username', async () => {
    await loginPage.login('wronguser', VALID_PASSWORD);
    
    expect(await loginPage.isOnLoginPage()).toBeTruthy();
    expect(await loginPage.isLoggedIn()).toBeFalsy();

    const errorMsg = await loginPage.getFlashMessage();
    expect(errorMsg).toContain('Your username is invalid!');

    const flashClass = await loginPage.getFlashClass();
    expect(flashClass).toContain('flash error');
  });

  test('TC003 - Failed login with invalid password', async () => {
    await loginPage.login(VALID_USERNAME, 'wrongpassword');
    
    expect(await loginPage.isOnLoginPage()).toBeTruthy();
    expect(await loginPage.isLoggedIn()).toBeFalsy();

    const errorMsg = await loginPage.getFlashMessage();
    expect(errorMsg).toContain('Your password is invalid!');

    const flashClass = await loginPage.getFlashClass();
    expect(flashClass).toContain('flash error');
  });

  test('TC004 - Verify error messages appear correctly', async () => {
    await loginPage.login('baduser', 'badpass');

    const errorMsg = await loginPage.getFlashMessage();
    expect(errorMsg).toMatch(/Your username is invalid!/);

    const flashClass = await loginPage.getFlashClass();
    expect(flashClass).toBe('flash error');
  });
  test('Print hello world', async () => {
  console.log("hello world");
});
});