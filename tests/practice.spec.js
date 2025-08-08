const { test, expect } = require('@playwright/test');

test('practice test - navigate to app.leni.co and verify login page', async ({ page }) => {
  // Navigate to app.leni.co
  await page.goto('https://app.leni.co');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Verify we're on the login page (app.leni.co redirects to login)
  await expect(page).toHaveURL(/.*\/login/);
  await expect(page).toHaveTitle(/Leni/);
  
  // Verify the main heading is present
  await expect(page.getByRole('heading', { name: 'Real estate insights, redefined.' })).toBeVisible();
  
  // Verify login form elements are present
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
  await expect(page.getByText('Log in to your account')).toBeVisible();
  
  // Verify form fields are present
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  
  // Verify login button is present
  await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
  
  // Verify "Forgot Password?" link is present
  await expect(page.getByText('Forgot Password?')).toBeVisible();
  
  // Verify "Product Demo" link is present
  await expect(page.getByText('Product Demo')).toBeVisible();
  
  // Take a screenshot for verification
  await page.screenshot({ path: 'test-results/leni-login-page.png' });
  
  console.log('Successfully navigated to app.leni.co and verified login page elements');
});

test('practice test - test login form interactions', async ({ page }) => {
  // Navigate to app.leni.co
  await page.goto('https://app.leni.co');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Test email field interaction
  const emailField = page.getByLabel('Email');
  await emailField.click();
  await emailField.fill('test@example.com');
  await expect(emailField).toHaveValue('test@example.com');
  
  // Test password field interaction
  const passwordField = page.getByLabel('Password');
  await passwordField.click();
  await passwordField.fill('testpassword123');
  await expect(passwordField).toHaveValue('testpassword123');
  
  // Test password visibility toggle (if available)
  const passwordToggle = page.locator('img[alt="password toggle"]').first();
  if (await passwordToggle.isVisible()) {
    await passwordToggle.click();
  }
  
  // Verify password requirement message
  await expect(page.getByText('Password must be a minimum of 8 characters.')).toBeVisible();
  
  console.log('Successfully tested login form interactions');
});

test('practice test - complete login form submission', async ({ page }) => {
  // Navigate to app.leni.co
  await page.goto('https://app.leni.co');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Fill in email
  const emailField = page.getByLabel('Email');
  await emailField.fill('test@example.com');
  
  // Fill in password
  const passwordField = page.getByLabel('Password');
  await passwordField.fill('testpassword123');
  
  // Submit the form
  await page.getByRole('button', { name: 'Log in' }).click();
  
  // Wait for the response and verify error message appears
  await page.waitForTimeout(2000); // Wait for API response
  
  // Verify error message appears (expected with test credentials)
  await expect(page.getByText("That email and password combination doesn't match our records.")).toBeVisible();
  
  // Take screenshot of the result
  await page.screenshot({ path: 'test-results/leni-login-error.png' });
  
  console.log('Successfully submitted login form and verified error handling');
});

test('practice test - complete signup form for landlord user', async ({ page }) => {
  // Navigate to signup page
  await page.goto('https://app.leni.co/signup');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Generate random email with imran+{random number}@leni.co format
  const randomNumber = Math.floor(Math.random() * 10000);
  const email = `imran+${randomNumber}@leni.co`;
  
  // Fill in user details
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('John', { exact: true }).fill('Automation');
  await page.getByLabel('Doe', { exact: true }).fill('Playwright');
  await page.getByLabel('Organisation Name').fill('Automation Playwright Company');
  await page.getByLabel('1 (702) 123-').fill('1234567890');
  
  // Fill in password fields
  await page.locator('input[name="password"]').fill('TestPassword123!');
  await page.locator('input[name="confirmPassword"]').fill('TestPassword123!');
  await page.locator('input[name="adminPassword"]').fill('SoulRooms247');
  
  // Select all views in Assign Views dropdown
  await page.getByRole('combobox').first().click();
  const viewOptions = [
    'Analytics', 'Convert', 'Price', 'Price Plus', 'LeniQ', 
    'Insights', 'Report Builder', 'Credit Checks', 'Application Module'
  ];
  
  for (const option of viewOptions) {
    await page.getByText(option).click();
  }
  
  // Select dashboard in Assign Dashboards dropdown
  await page.getByRole('combobox').filter({ hasText: 'Select' }).click();
  await page.getByText('Executive Summary').click();
  
  // Take screenshot before submission
  await page.screenshot({ path: 'test-results/leni-signup-form-completed.png' });
  
  // Submit the form
  await page.getByRole('button', { name: 'Sign Up' }).click();
  
  // Wait for form processing and verify success
  await page.waitForTimeout(3000);
  
  // Verify account creation success (redirected to login page)
  await expect(page).toHaveURL(/.*\/login/);
  
  // Take screenshot after submission
  await page.screenshot({ path: 'test-results/leni-signup-form-final.png' });
  
  console.log(`Successfully completed signup form for landlord user with email: ${email}`);
}); 