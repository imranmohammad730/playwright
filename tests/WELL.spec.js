
const { test, expect } = require('@playwright/test');

// Load environment variables
require('dotenv').config();

test.describe('WELL Compliance Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('https://dashboard.kaiterra.com/login');
    await page.waitForLoadState('networkidle');
    
    // Use environment variables for credentials
    const email = process.env.TEST_EMAIL || 'test@example.com';
    const password = process.env.TEST_PASSWORD || 'testpassword';
    
    await page.fill('input[name="email"], input[type="email"]', email);
    await page.fill('input[name="password"], input[type="password"]', password);
    await page.click('button[type="submit"], button:has-text("Log in"), button:has-text("Login")');
    await page.waitForURL(/.*\/dashboard/);
    console.log('✅ Login successful');

    try {
      await page.click('a:has-text("Compliance"), button:has-text("Compliance"), li:has-text("Compliance")');
    } catch {
      await page.goto('https://dashboard.kaiterra.com/me/compliance/well-compliance-v2');
    }
    await page.waitForURL(/.*\/well-compliance-v2/);
    console.log('✅ Navigated to WELL compliance page');
  });

  test('should verify header elements', async ({ page }) => {
    await expect(page.locator('h1:has-text("Compliance Reports")')).toBeVisible();
    console.log('✅ Main heading verified');

    await expect(page.locator('text="Stay on top of WELL compliance. Export your data in the certification-ready format."')).toBeVisible();
    console.log('✅ Description text verified');

    await expect(page.locator('button:has-text("Create new")')).toBeVisible();
    console.log('✅ Create new button verified');

    await expect(page.locator('a:has-text("Learn more")')).toBeVisible();
    console.log('✅ Learn more link verified');

    // Validate Learn more link has correct URL
    const learnMoreLink = page.locator('a:has-text("Learn more")');
    await expect(learnMoreLink).toHaveAttribute('href', 'https://learn.kaiterra.com/en/resources/how-to-maximize-your-iwbi-well-v2-scorecard-with-iaq-optimizations');
    console.log('✅ Learn more link URL verified');

    await expect(page.locator('a:has-text("Disclaimer")')).toBeVisible();
    console.log('✅ Disclaimer link verified');

    // Validate Disclaimer link has correct URL
    const disclaimerLink = page.locator('a:has-text("Disclaimer")');
    await expect(disclaimerLink).toHaveAttribute('href', '#');
    console.log('✅ Disclaimer link URL verified');

    // Click on Disclaimer link to open modal
    await disclaimerLink.click();
    console.log('✅ Clicked Disclaimer link');

    // Wait for disclaimer modal to appear
    await page.waitForSelector('.ant-modal-content');
    console.log('✅ Disclaimer modal appeared');

    // Verify modal title
    await expect(page.locator('.ant-modal-title')).toHaveText('Disclaimer');
    console.log('✅ Disclaimer modal title verified');

    // Verify modal content
    const modalBody = page.locator('.ant-modal-body');
    await expect(modalBody).toContainText('This report checks your data from our indoor air quality sensors for compliance with certain requirements of the WELL Building Standard v2.');
    await expect(modalBody).toContainText('This feature only pertains to the analytes we measure, including CO2, PM2.5, PM10, TVOC, temperature, and humidity.');
    await expect(modalBody).toContainText('However, please note that compliance with these requirements does not guarantee or promise WELL certification, as there are many other features that need to be considered.');
    await expect(modalBody).toContainText('Additionally, users are responsible for ensuring they have installed the correct number of sensors and placed them in the appropriate locations as required by the standard.');
    await expect(modalBody).toContainText('Our tool is meant to help you organize and quickly assess your data, but it cannot replace the full scope of WELL certification requirements.');
    console.log('✅ Disclaimer modal content verified');

    // Verify close button is present
    await expect(page.locator('.ant-modal-close')).toBeVisible();
    console.log('✅ Disclaimer modal close button verified');

    // Click close button to close modal
    await page.click('.ant-modal-close');
    console.log('✅ Clicked close button');

    // Wait for modal to close
    await page.waitForSelector('.ant-modal-content', { state: 'hidden' });
    console.log('✅ Disclaimer modal closed');
  });

  test('should verify table elements', async ({ page }) => {
    await expect(page.locator('th:has-text("Name")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();
    console.log('✅ Table headers verified');

    const tableRows = page.locator('tbody tr:not([aria-hidden="true"]):not(.ant-table-measure-row)');
    await expect(tableRows.first()).toBeVisible();
    console.log('✅ Table rows verified');

    await expect(page.locator('input[placeholder="Search reports"]')).toBeVisible();
    console.log('✅ Search input verified');

    await expect(page.locator('p:has(strong):has-text("of"):has-text("results")')).toBeVisible();
    console.log('✅ Results counter verified');
  });

  test('should create WELL report for Imran’s house', async ({ page }) => {
    const reportName = "Imran’s house";

    await page.click('button:has-text("Create new")');
    console.log('✅ Clicked Create new button');

    await page.waitForSelector('div[role="dialog"]:has-text("Create Report")');
    console.log('✅ Creation dialog loaded');

    await page.click('[role="combobox"]');
    console.log('✅ Clicked Building combobox');

    await page.type('[role="combobox"]', 'imran', { delay: 100 });
    await page.waitForTimeout(1500);
    console.log('✅ Typed "imran" to filter options');

    await page.getByText("Imran’s house").click();
    console.log('✅ Selected Imran’s house building');

    await page.waitForSelector('button:has-text("Create report"):not([disabled])');
    console.log('✅ Create report button is enabled');

    await page.click('button:has-text("Create report")');
    console.log('✅ Clicked Create report button');

    try {
      await page.waitForSelector('text="Report created!"', { timeout: 5000 });
      console.log('✅ Success message displayed: "Report created!"');
    } catch {
      console.log('⚠️ No explicit success message found, continuing');
    }

    await page.waitForSelector('div[role="dialog"]:has-text("Create Report")', { state: 'hidden' });
    console.log('✅ Dialog closed');

    await expect(page.locator(`tr:has-text("${reportName}")`)).toBeVisible();
    console.log('✅ New report appears in the table');
  });

  test('should delete WELL report', async ({ page }) => {
    const reportName = "Imran’s house";

    await expect(page.locator(`tr:has-text("${reportName}")`)).toBeVisible();
    console.log('✅ Report found, proceeding with deletion');

    const reportRow = page.locator(`tr:has-text("${reportName}")`);
    await reportRow.locator('button').last().click();
    console.log('✅ Clicked action menu');

    await page.click('text="Delete"');
    console.log('✅ Selected Delete option');

    await page.waitForSelector('div[role="dialog"]:has-text("Delete Report")');
    console.log('✅ Confirmation dialog appeared');

    await expect(
      page.locator('text="Are you sure you want to delete this report?"')
    ).toBeVisible();
    console.log('✅ Confirmation message verified');

    await page.click('button:has-text("Delete report")');
    console.log('✅ Clicked Delete report button');

    await page.waitForSelector('div[role="dialog"]:has-text("Delete Report")', { state: 'hidden' });
    console.log('✅ Confirmation dialog closed');

    try {
      await page.waitForSelector('text="Report deleted!"', { timeout: 5000 });
      console.log('✅ Success notification received');
    } catch {
      console.log('⚠️ No explicit success notification, proceeding');
    }

    await expect(page.locator(`tr:has-text("${reportName}")`)).not.toBeVisible();
    console.log('✅ Report removed from table');

    const resultsText = await page
      .locator('p:has(strong):has-text("of"):has-text("results")')
      .textContent();
    console.log('📊 Updated results count:', resultsText);
  });

  test('should open WELL report and verify details page', async ({ page }) => {
    const reportName = "AU bldg test";
    
    // Verify the report exists in the table
    await expect(page.locator(`tr:has-text("${reportName}")`)).toBeVisible();
    console.log('✅ Report found in table');

    // Click on the report name to open details page
    await page.click(`a:has-text("${reportName}")`);
    console.log('✅ Clicked on report name');

    // Wait for navigation to report details page
    await page.waitForURL(/.*\/well-compliance-v2\/.*/);
    console.log('✅ Navigated to report details page');

    // Verify back arrow is present
    await expect(page.locator('a[href="/me/compliance/well-compliance-v2"]')).toBeVisible();
    console.log('✅ Back arrow verified');

    // Verify report title
    await expect(page.locator('h1')).toHaveText(reportName);
    console.log('✅ Report title verified');

    // Verify address is displayed
    await expect(page.locator('text=477 Collins St, Southbank VIC 3000, Australia')).toBeVisible();
    console.log('✅ Address verified');

    // Verify Subscribe button
    await expect(page.locator('button:has-text("Subscribe")')).toBeVisible();
    console.log('✅ Subscribe button verified');

    // Verify Export button
    await expect(page.locator('button:has-text("Export")')).toBeVisible();
    console.log('✅ Export button verified');

    // Verify tabs are present
    await expect(page.locator('div[role="tab"]:has-text("WELL Summary")')).toBeVisible();
    await expect(page.locator('div[role="tab"]:has-text("Device Summary")')).toBeVisible();
    console.log('✅ Tabs verified');

    // Verify WELL Summary tab is selected
    await expect(page.locator('div[role="tab"][aria-selected="true"]:has-text("WELL Summary")')).toBeVisible();
    console.log('✅ WELL Summary tab is selected');

    // Verify time period selector
    await expect(page.locator('button:has-text("Last 30 days")')).toBeVisible();
    console.log('✅ Time period selector verified');

    // Verify Preconditions Status section
    await expect(page.locator('h3:has-text("Preconditions Status")')).toBeVisible();
    await expect(page.locator('text=0 of 3 met')).toBeVisible();
    await expect(page.locator('text=Required for certification')).toBeVisible();
    console.log('✅ Preconditions Status section verified');

    // Verify WELL Optimization Points section
    await expect(page.locator('h3:has-text("WELL Optimization Points")')).toBeVisible();
    await expect(page.locator('text=0 of 7 points')).toBeVisible();
    await expect(page.locator('text=From continuous monitoring')).toBeVisible();
    console.log('✅ WELL Optimization Points section verified');

    // Verify Needs Attention section
    await expect(page.locator('h3:has-text("Needs Attention")')).toBeVisible();
    await expect(page.locator('text=5 Non-compliant')).toBeVisible();
    await expect(page.locator('p:has-text("Targeted optimizations")')).toBeVisible();
    console.log('✅ Needs Attention section verified');

    // Verify WELL Monitor Requirements section
    await expect(page.locator('h3:has-text("WELL Monitor Requirements")')).toBeVisible();
    await expect(page.locator('text=Enter your property size to calculate monitor requirements')).toBeVisible();
    await expect(page.locator('button:has-text("Set property size")')).toBeVisible();
    console.log('✅ WELL Monitor Requirements section verified');

    // Verify Preconditions table
    await expect(page.locator('h3:has-text("Preconditions")')).toBeVisible();
    await expect(page.locator('text=Feature/Requirement')).toBeVisible();
    await expect(page.locator('text=Threshold')).toBeVisible();
    await expect(page.locator('text=Points')).toBeVisible();
    await expect(page.locator('text=Status')).toBeVisible();
    await expect(page.locator('text=Device Compliance')).toBeVisible();
    console.log('✅ Preconditions table headers verified');

    // Verify specific precondition items
    await expect(page.locator('text=A01: Air Quality')).toBeVisible();
    await expect(page.locator('text=A03: Ventilation Design')).toBeVisible();
    await expect(page.locator('text=T01: Thermal Performance')).toBeVisible();
    console.log('✅ Preconditions items verified');

    // Verify specific precondition requirements
    await expect(page.locator('text=Meet Thresholds for Particulate Matter')).toBeVisible();
    await expect(page.locator('text=Meet Thresholds For Organic Gases')).toBeVisible();
    await expect(page.locator('text=Ensure Adequate Ventilation')).toBeVisible();
    await expect(page.locator('text=Provide Acceptable Thermal Environment')).toBeVisible();
    await expect(page.locator('text=Measure Thermal Parameters')).toBeVisible();
    console.log('✅ Preconditions requirements verified');

    // Verify specific thresholds
    await expect(page.locator('text=PM2.5 < 15 µg/m³')).toBeVisible();
    await expect(page.locator('text=PM10 < 50 µg/m³')).toBeVisible();
    await expect(page.locator('text=TVOC < 500 µg/m³')).toBeVisible();
    await expect(page.locator('text=CO2 < 900 ppm')).toBeVisible();
    await expect(page.locator('text=between 20 and 26 °C')).toBeVisible();
    console.log('✅ Preconditions thresholds verified');

    // Verify Targeted Optimizations table
    await expect(page.locator('h3:has-text("Targeted Optimizations")')).toBeVisible();
    console.log('✅ Targeted Optimizations section verified');

    // Verify specific optimization items
    await expect(page.locator('text=A05: Air Quality')).toBeVisible();
    await expect(page.locator('text=A06: Enhanced Ventilation Design')).toBeVisible();
    await expect(page.locator('text=A08: Air Quality Monitoring and Awareness')).toBeVisible();
    await expect(page.locator('text=T06: Thermal Comfort Monitoring')).toBeVisible();
    await expect(page.locator('text=T07: Humidity Control')).toBeVisible();
    console.log('✅ Targeted Optimizations items verified');

    // Verify specific optimization requirements
    await expect(page.locator('text=Meet Enhanced Thresholds for Particulate Matter')).toBeVisible();
    await expect(page.locator('text=Further Meet Enhanced Thresholds for Particulate Matter')).toBeVisible();
    await expect(page.locator('text=Increase Outdoor Air Supply')).toBeVisible();
    await expect(page.locator('text=Further Increase Outdoor Air Supply')).toBeVisible();
    await expect(page.locator('text=Install Indoor Air Monitors')).toBeVisible();
    await expect(page.locator('text=Monitor Thermal Environment')).toBeVisible();
    await expect(page.locator('text=Manage Relative Humidity')).toBeVisible();
    console.log('✅ Targeted Optimizations requirements verified');

    // Verify enhanced thresholds
    await expect(page.locator('text=PM2.5 < 12 µg/m³')).toBeVisible();
    await expect(page.locator('text=PM10 < 30 µg/m³')).toBeVisible();
    await expect(page.locator('text=PM2.5 < 10 µg/m³')).toBeVisible();
    await expect(page.locator('text=PM10 < 20 µg/m³')).toBeVisible();
    await expect(page.locator('text=CO2 < 750 ppm')).toBeVisible();
    await expect(page.locator('text=between 30% and 60%')).toBeVisible();
    console.log('✅ Enhanced thresholds verified');

    // Verify status tags
    await expect(page.locator('span:has-text("Needs Attention")')).toBeVisible();
    console.log('✅ Status tags verified');

    // Verify progress bars
    await expect(page.locator('div[class*="bg-midnight-blue-100"]')).toBeVisible();
    console.log('✅ Progress bars verified');

    // Test Needs Attention card interaction
    console.log('🔍 Testing Needs Attention card...');
    await page.click('h3:has-text("Needs Attention")');
    console.log('✅ Clicked Needs Attention card');

    // Wait for drawer to appear and verify its contents
    await page.waitForSelector('div[role="dialog"]:has-text("Features Needing Attention")');
    console.log('✅ Needs Attention drawer opened');

    // Verify drawer title
    await expect(page.locator('text="Features Needing Attention"')).toBeVisible();
    console.log('✅ Drawer title verified');

    // Verify date range
    await expect(page.locator('text="Date: 07 Jul. 2025 - 06 Aug. 2025"')).toBeVisible();
    console.log('✅ Date range verified');

    // Verify feature details in the drawer
    await expect(page.locator('h4:has-text("A05 - Meet Enhanced Thresholds for Particulate Matter")')).toBeVisible();
    await expect(page.locator('h4:has-text("A05 - Further Meet Enhanced Thresholds for Particulate Matter")')).toBeVisible();
    await expect(page.locator('h4:has-text("A06 - Increase Outdoor Air Supply")')).toBeVisible();
    await expect(page.locator('h4:has-text("A06 - Further Increase Outdoor Air Supply")')).toBeVisible();
    await expect(page.locator('h4:has-text("A08 - Install Indoor Air Monitors")')).toBeVisible();
    await expect(page.locator('h4:has-text("T06 - Monitor Thermal Environment")')).toBeVisible();
    await expect(page.locator('h4:has-text("T07 - Manage Relative Humidity")')).toBeVisible();
    console.log('✅ Feature details in drawer verified');

    // Verify requirements and device compliance info
    await expect(page.locator('text="PM2.5 < 12 µg/m³ for 90% of operating hours"')).toBeVisible();
    await expect(page.locator('text="PM2.5 < 10 µg/m³ for 90% of operating hours"')).toBeVisible();
    await expect(page.locator('text="CO2 < 900 ppm for 90% of operating hours"')).toBeVisible();
    await expect(page.locator('text="CO2 < 750 ppm for 90% of operating hours"')).toBeVisible();
    await expect(page.locator('text="Air monitors are online"')).toBeVisible();
    await expect(page.locator('text="Has Temperature data"')).toBeVisible();
    await expect(page.locator('text="Humidity between 30% -60% for 90% of operating hours"')).toBeVisible();
    console.log('✅ Requirements in drawer verified');

    // Verify device compliance messages
    await expect(page.locator('text="1 of 1 devices non compliant"')).toBeVisible();
    console.log('✅ Device compliance messages verified');

    // Close the drawer
    await page.click('button:has-text("Close")');
    console.log('✅ Closed Needs Attention drawer');

    // Test Set Property Size button interaction
    console.log('🔍 Testing Set Property Size button...');
    await page.click('button:has-text("Set property size")');
    console.log('✅ Clicked Set property size button');

    // Wait for modal to appear and verify its contents
    await page.waitForSelector('div[role="dialog"]:has-text("WELL Monitor Requirements")');
    console.log('✅ Property size modal opened');

    // Verify modal title
    await expect(page.locator('text="WELL Monitor Requirements"')).toBeVisible();
    console.log('✅ Modal title verified');

    // Verify property size input and unit selector
    await expect(page.locator('text="Property size"')).toBeVisible();
    await expect(page.locator('spinbutton')).toBeVisible();
    await expect(page.locator('combobox')).toBeVisible();
    await expect(page.locator('text="ft²"')).toBeVisible();
    console.log('✅ Property size input elements verified');

    // Verify info alert
    await expect(page.locator('text="The minimum number of monitors required is based on your occupiable space. Refer to the table below to determine the minimum number needed for certification."')).toBeVisible();
    console.log('✅ Info alert verified');

    // Verify table headers
    await expect(page.locator('text="Area of Occupiable Space"')).toBeVisible();
    await expect(page.locator('text="Monitor Density"')).toBeVisible();
    await expect(page.locator('text="Minimum # of Monitors"')).toBeVisible();
    console.log('✅ Table headers verified');

    // Verify table content
    await expect(page.locator('text="< 3,250 m² (35,000 ft²)"')).toBeVisible();
    await expect(page.locator('text="1 monitor per 325 m² (3,500 ft²)"')).toBeVisible();
    await expect(page.locator('text="2"')).toBeVisible();
    await expect(page.locator('text="3,250 - 25,000 m² (35k-269.1k ft²)"')).toBeVisible();
    await expect(page.locator('text="1 monitor per 500 m² (5,400 ft²)"')).toBeVisible();
    await expect(page.locator('text="10"')).toBeVisible();
    await expect(page.locator('text="> 25,000 m² (269,100 ft²)"')).toBeVisible();
    await expect(page.locator('text="1 monitor per 1,000 m² (10,800 ft²)"')).toBeVisible();
    await expect(page.locator('text="50"')).toBeVisible();
    console.log('✅ Table content verified');

    // Verify buttons
    await expect(page.locator('button:has-text("Cancel")')).toBeVisible();
    await expect(page.locator('button:has-text("Save changes")')).toBeVisible();
    console.log('✅ Modal buttons verified');

    // Close the modal
    await page.click('button:has-text("Close")');
    console.log('✅ Closed property size modal');

    // Click on Device Summary tab to verify it works
    await page.click('div[role="tab"]:has-text("Device Summary")');
    console.log('✅ Clicked Device Summary tab');

    // Wait for tab to be selected
    await expect(page.locator('div[role="tab"][aria-selected="true"]:has-text("Device Summary")')).toBeVisible();
    console.log('✅ Device Summary tab is now selected');

    // Click back to WELL Summary tab
    await page.click('div[role="tab"]:has-text("WELL Summary")');
    console.log('✅ Clicked back to WELL Summary tab');

    // Verify WELL Summary tab is selected again
    await expect(page.locator('div[role="tab"][aria-selected="true"]:has-text("WELL Summary")')).toBeVisible();
    console.log('✅ WELL Summary tab is selected again');

    // Click back arrow to return to reports list
    await page.click('a[href="/me/compliance/well-compliance-v2"]');
    console.log('✅ Clicked back arrow');

    // Wait for navigation back to reports list
    await page.waitForURL(/.*\/well-compliance-v2$/);
    console.log('✅ Returned to reports list');

    // Verify we're back on the reports list page
    await expect(page.locator('h1:has-text("Compliance Reports")')).toBeVisible();
    console.log('✅ Back on reports list page');
  });
});

