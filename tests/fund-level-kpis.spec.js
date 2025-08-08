const { test, expect } = require('@playwright/test');

test.describe('Fund Level KPIs', () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Login to the application with increased timeout
    await page.goto('https://staging.leni.co/login', { timeout: 60000 });
    
    // Use a more reliable wait strategy
    try {
      await page.waitForLoadState('networkidle', { timeout: 30000 });
    } catch (e) {
      // Fallback to load state if networkidle times out
      await page.waitForLoadState('load', { timeout: 15000 });
    }
    
    // Fill login credentials
    await page.locator('input[name="email"]').fill('shruti@leni.co');
    await page.locator('input[name="password"]').fill('qqx2vL2Wu5zvY2hS');
    
    // Click login button
    await page.locator('button[type="submit"], button:has-text("Log in")').click();
    
    // Wait for successful login with increased timeout
    await page.waitForURL(/.*\/dashboard/, { timeout: 30000 });
    
    // Wait for dashboard to load
    try {
      await page.waitForLoadState('networkidle', { timeout: 30000 });
    } catch (e) {
      await page.waitForLoadState('load', { timeout: 15000 });
    }
    
    // Navigate to Report Builder
    await page.goto('https://staging.leni.co/dashboard/report-builder', { timeout: 60000 });
    
    // Wait for Report Builder to load
    try {
      await page.waitForLoadState('networkidle', { timeout: 30000 });
    } catch (e) {
      await page.waitForLoadState('load', { timeout: 15000 });
    }
    
    // Verify we're actually on the Report Builder page
    await page.waitForURL(/.*\/report-builder/, { timeout: 10000 });
    console.log('✅ Successfully navigated to Report Builder');
    
    // Wait a bit more for the page to fully render
    await page.waitForTimeout(2000);
  });

  test('should save report with Fund Level Automation workflow', async ({ page }) => {
    // Debug: Check if we're on the right page
    console.log('Current URL:', page.url());
    
    // Wait for the Report Builder page to be fully loaded
    try {
      await page.waitForSelector('input[placeholder="Report Name"]', { state: 'visible', timeout: 30000 });
      console.log('✅ Report Name input found');
    } catch (e) {
      console.log('❌ Report Name input not found. Current page content:');
      const content = await page.content();
      console.log(content.substring(0, 1000)); // Log first 1000 chars
      throw e;
    }
    
    // Step 1: Give the report a name
    await page.locator('input[placeholder="Report Name"]').fill('Fund Level Automation');
    await page.waitForTimeout(1000); // Wait 1 second
    
    // Step 2: Select all properties from the top dropdown
    await page.waitForSelector('input[placeholder="Select Property"]', { state: 'visible', timeout: 10000 });
    await page.locator('input[placeholder="Select Property"]').click();
    await page.waitForTimeout(500);
    await page.waitForSelector('div[role="option"]', { hasText: 'Select All' }, { state: 'visible', timeout: 10000 });
    await page.locator('div[role="option"]', { hasText: 'Select All' }).click();
    await page.waitForTimeout(1000);
    
    // Step 3: Click on Detail Financial to expand
    await page.waitForSelector('button:has-text("Detail Financial")', { state: 'visible', timeout: 10000 });
    await page.locator('button:has-text("Detail Financial")').click();
    await page.waitForTimeout(500);
    await page.locator('button:has-text("Detail Financial")').click(); // Click again to expand if it collapsed
    await page.waitForTimeout(1000);
    
    // Step 4: Click on Create New Set
    await page.waitForSelector('button:has-text("Create New Set")', { state: 'visible', timeout: 10000 });
    await page.locator('button:has-text("Create New Set")').click();
    await page.waitForTimeout(1000);
    
    // Step 5: Verify elements of the modal (assertions would go here in a real test)
    await expect(page.locator('h2:has-text("Create New Set")')).toBeVisible();
    await expect(page.locator('input[placeholder="Enter entity name"]')).toBeVisible();
    await expect(page.locator('div[role="combobox"]:has-text("Select a building")')).toBeVisible();
    await expect(page.locator('input[placeholder="%"]')).toBeVisible();
    await expect(page.locator('button:has-text("+ Add")')).toBeDisabled();
    await expect(page.locator('text="Total Allocation: 0%"')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeDisabled();
    await page.waitForTimeout(1000);
    
    // Step 6: Enter entity name
    await page.locator('input[placeholder="Enter entity name"]').fill('Entity 1');
    await page.waitForTimeout(500);
    
    // Step 7: Open select a building dropdown and select first building
    await page.locator('div[role="combobox"]:has-text("Select a building")').click();
    await page.waitForTimeout(500);
    await page.locator('div[role="option"]').first().click(); // Selects "Sky 2"
    await page.waitForTimeout(1000);
    
    // Step 8: Enter percentage
    await page.locator('input[placeholder="%"]').fill('20');
    await page.waitForTimeout(500);
    
    // Step 9: Click +Add button
    await page.locator('button:has-text("+ Add")').click();
    await page.waitForTimeout(1000);
    
    // Step 10: Verify Total Allocation shows 20%
    await expect(page.locator('text="Total Allocation: 20%"')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeEnabled();
    await page.waitForTimeout(1000);
    
    // Step 11: Click Next button
    await page.locator('button:has-text("Next")').click();
    await page.waitForTimeout(1000);
    
    // Step 12: Verify new modal elements visibility (Step 2 of Create New Set)
    await expect(page.locator('input[placeholder="Title"]')).toBeVisible();
    await expect(page.locator('div[role="combobox"]:has-text("Date range")')).toBeVisible();
    await expect(page.locator('button:has-text("Add Section")')).toBeVisible();
    await expect(page.locator('button:has-text("Preview")')).toBeVisible();
    await expect(page.locator('button:has-text("Back")')).toBeVisible();
    await expect(page.locator('button:has-text("Next")')).toBeDisabled();
    await page.waitForTimeout(1000);
    
    // Step 13: Enter title
    await page.locator('input[placeholder="Title"]').fill('QA title');
    await page.waitForTimeout(500);
    
    // Step 14: Open Date range dropdown and select Last 3 Months
    await page.locator('div[role="combobox"]:has-text("Date range")').click();
    await page.waitForTimeout(500);
    await page.locator('div[role="option"]', { hasText: 'Last 3 Months' }).click();
    await page.waitForTimeout(1000);
    
    // Step 15: Enter section title
    await page.locator('input[placeholder="Section title"]').fill('Title 1');
    await page.waitForTimeout(500);
    await page.locator('button[aria-label="Save"]').click(); // Tick button
    await page.waitForTimeout(1000);
    
    // Step 16: Click on 3 dots and verify options
    await page.locator('button[aria-label="More options"]').click(); // 3 dots button
    await page.waitForTimeout(500);
    await expect(page.locator('div[role="menuitem"]:has-text("Move Up")')).toBeVisible();
    await expect(page.locator('div[role="menuitem"]:has-text("Move Down")')).toBeVisible();
    await expect(page.locator('div[role="menuitem"]:has-text("Duplicate")')).toBeVisible();
    await expect(page.locator('div[role="menuitem"]:has-text("Convert to Positive")')).toBeVisible();
    await expect(page.locator('div[role="menuitem"]:has-text("Convert to Negative")')).toBeVisible();
    await expect(page.locator('div[role="menuitem"]:has-text("Delete")')).toBeVisible();
    await page.keyboard.press('Escape'); // Close the 3 dots menu
    await page.waitForTimeout(1000);
    
    // Step 17: Click on Select Tree and select first value
    await page.locator('button:has-text("Select Tree")').first().click();
    await page.waitForTimeout(500);
    await page.locator('div[role="option"]').first().click(); // Selects "madison_isres"
    await page.waitForTimeout(1000);
    
    // Step 18: Click on Select GL codes and select the first 5 checkboxes
    await page.locator('div[role="combobox"]').nth(1).click(); // GL codes dropdown
    await page.waitForTimeout(500);
    // Select first 5 GL codes
    for (let i = 0; i < 5; i++) {
      await page.locator('div[role="option"]').nth(i + 1).click(); // Skip first option (already selected)
      await page.waitForTimeout(300);
    }
    await page.waitForTimeout(1000);
    
    // Step 19: Click the + button to add GL codes
    await page.locator('button:has-text("+")').click();
    await page.waitForTimeout(1000);
    
    // Step 20: Click Next button
    await page.locator('button:has-text("Next")').click();
    await page.waitForTimeout(2000); // Longer wait for modal to close and report to be created
    
    // Step 21: Wait for report creation to complete
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('text="QA title"', { state: 'visible' }); // Wait for the report to appear in the left panel
    await page.waitForTimeout(1000);
    
    // Step 22: Click on the checkbox for the report
    await page.locator('input[type="checkbox"][aria-label="QA title"]').click();
    await page.waitForTimeout(1000);
    
    // Step 23: Click generate
    await page.locator('button:has-text("Generate")').click();
    await page.waitForTimeout(2000); // Longer wait for report generation
    
    // Step 24: Wait for report to generate and verify elements
    await page.waitForSelector('div.report-body', { state: 'visible', timeout: 30000 }); // Example selector for report body
    await expect(page.locator('text="Entity 1"')).toBeVisible(); // Verify entity name in report body
    await expect(page.locator('text="Fund Level Automation"')).toBeVisible(); // Verify report title
    await expect(page.locator('text="QA title"')).toBeVisible(); // Verify report name
    await expect(page.locator('text="Date Range: Last 3 Months"')).toBeVisible(); // Verify date range
    await expect(page.locator('text="Building Allocations:"')).toBeVisible(); // Verify building allocations section
    await expect(page.locator('text="Sky 2: 20%"')).toBeVisible(); // Verify building allocation
    await page.waitForTimeout(1000);
    
    // Step 25: Click on save
    await page.locator('button:has-text("Save")').click();
    await page.waitForTimeout(1000);
    
    // Step 26: Handle save confirmation dialog if it appears (optional)
    try {
      await page.waitForSelector('text="A report already exists with this title - Overwrite report?"', { timeout: 5000 });
      await page.waitForTimeout(500);
      await page.locator('button:has-text("Save")').click(); // Click Save in the dialog
      await page.waitForTimeout(1000);
    } catch (e) {
      // Dialog didn't appear, which is fine - continue with the test
    }
    
    // Step 27: Wait for save operation to complete
    await page.waitForSelector('button:has-text("Saving Report..."), button:has-text("Save")', { timeout: 10000 });
    await page.waitForTimeout(1000);
    
    // Step 28: Click on Saved Reports button to verify the report was saved
    await page.locator('button:has-text("Saved Reports")').click();
    await page.waitForTimeout(1000);
    
    // Step 29: Verify the saved report appears in the Saved Reports section
    await expect(page.locator('text="Fund Level Automation"')).toBeVisible();
    await expect(page.locator('text="QA title"')).toBeVisible();
    await expect(page.locator('text="Entity 1"')).toBeVisible();
    await page.waitForTimeout(1000);
  });
}); 