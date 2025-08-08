const { expect } = require('@playwright/test');

class KaiterraLogin {
  constructor(page) {
    this.page = page;
    
    // Specific selectors for better reliability
    this.emailInput = 'input[name="email"], input[type="email"]';
    this.passwordInput = 'input[name="password"], input[type="password"]';
    this.loginButton = 'button[type="submit"], button:has-text("Log in"), button:has-text("Login")';
    this.loginForm = 'form';
  }

  async goto() {
    await this.page.goto('https://dashboard.kaiterra.com/login');
    await this.page.waitForLoadState('networkidle');
    
    // Verify we're on the login page
    await expect(this.page).toHaveURL(/.*\/login/);
    await expect(this.page.locator(this.loginForm)).toBeVisible();
  }

  async login(email, password) {
    // Verify login form elements are visible
    await expect(this.page.locator(this.emailInput)).toBeVisible();
    await expect(this.page.locator(this.passwordInput)).toBeVisible();
    await expect(this.page.locator(this.loginButton)).toBeVisible();
    
    // Fill credentials
    await this.page.fill(this.emailInput, email);
    await this.page.fill(this.passwordInput, password);
    
    // Verify credentials are filled
    await expect(this.page.locator(this.emailInput)).toHaveValue(email);
    await expect(this.page.locator(this.passwordInput)).toHaveValue(password);
    
    // Submit login
    await this.page.click(this.loginButton);
    
    // Wait for successful login
    await this.page.waitForURL(/.*\/dashboard/);
    
    // Verify we're logged in (should not be on login page)
    await expect(this.page).not.toHaveURL(/.*\/login/);
  }
}

module.exports = KaiterraLogin; 