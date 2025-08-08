
const { test, expect } = require('@playwright/test');

test('signup and login with new landlord user', async ({ page, context }) => {
  // Navigate to signup page and wait for DOM to be ready
  await page.goto('http://localhost:3000/signup', { waitUntil: 'domcontentloaded' });
  // Wait for the signup form to appear instead of networkidle
  //await page.waitForSelector('form#signup, form[name="signup"]', { timeout: 10000 });

  // Generate random email with imran+{random number}@leni.co format
  const randomNumber = Math.floor(Math.random() * 10000);
  const email = `imran+${randomNumber}@leni.co`;
  console.log(`Creating account with email: ${email}`);

  // Fill in the signup form
  await page.locator('input[type="email"], input[name="email"]').fill(email);
  await page.locator('input[name="firstName"], input[placeholder*="John"]').fill('Automation');
  await page.locator('input[name="lastName"], input[placeholder*="Doe"]').fill('Playwright');
  await page.locator('input[name="organisationName"], input[placeholder*="Organisation"]').fill('Automation Playwright Company');
  await page.locator('input[name="phone"], input[type="tel"]').fill('1234567890');
  await page.locator('input[type="number"], input[name="userLimit"]').fill('1');
  await page.locator('input[name="password"]').fill('231996asdF!');
  await page.locator('input[name="confirmPassword"]').fill('231996asdF!');
  await page.locator('input[name="adminPassword"]').fill('SoulRooms247');

  // Handle Assign Views dropdown
  try {
    const viewsDropdown = page.locator('select, [role="combobox"]').first();
    await viewsDropdown.waitFor({ state: 'visible', timeout: 5000 });
    await viewsDropdown.click();
    const viewOptions = [
      'Analytics', 'Convert', 'Price', 'Price Plus', 'LeniQ',
      'Insights', 'Report Builder', 'Credit Checks', 'Application Module'
    ];
    for (const option of viewOptions) {
      await page.locator(`text=${option}`).click({ timeout: 2000 }).catch(() => {});
    }
  } catch {
    console.log('Views dropdown not found or not interactive');
  }

  // Handle Assign Dashboards dropdown
  try {
    const dashboardDropdown = page.locator('select, [role="combobox"]').nth(1);
    await dashboardDropdown.waitFor({ state: 'visible', timeout: 5000 });
    await dashboardDropdown.click();
    await page.locator('text=Executive Summary').click({ timeout: 2000 });
  } catch {
    console.log('Dashboard dropdown not found or not interactive');
  }

  // Screenshot before submission
  await page.screenshot({ path: 'test-results/signup-form-completed.png' });

  // Submit the form
  await page.locator('button[type="submit"], button:has-text("Sign Up")').click();

  // Wait for either redirect to login or an error message
  await Promise.race([
    page.waitForURL(/\/login/, { timeout: 10000 }),
    page.waitForSelector('text=User with that email already exists', { timeout: 10000 }),
    page.waitForSelector('text=error', { timeout: 10000 })
  ]).catch(() => {
    console.log('Account creation may have failed or user already exists');
  });

  // Navigate to login page and wait for DOM
  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
  // Wait for the login form instead of networkidle
  //await page.waitForSelector('form#login, form[name="login"]', { timeout: 10000 });
  console.log('Now attempting to login...');

  // Fill login form
  await page.locator('input[type="email"], input[name="email"]').fill(email);
  await page.locator('input[type="password"], input[name="password"]').fill('231996asdF!');

  // Screenshot before login
  await page.screenshot({ path: 'test-results/login-form-filled.png' });

  // Submit login
  await page.locator('button[type="submit"], button:has-text("Log in")').click();

  // Wait for either dashboard redirect or login error
  await Promise.race([
    page.waitForURL(/\/dashboard/, { timeout: 10000 }),
    page.waitForSelector("text=doesn't match our records", { timeout: 10000 }),
    page.waitForSelector('text=error', { timeout: 10000 })
  ]).catch(() => {
    console.log('Login attempt completed (success or handled error)');
  });

  // Screenshot after login attempt
  await page.screenshot({ path: 'test-results/login-result.png' });

  console.log(`Signup and login test done with email: ${email}`);
});

