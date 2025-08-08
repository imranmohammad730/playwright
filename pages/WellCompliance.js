class WellCompliance {
  constructor(page) {
    this.page = page;
    
    // Specific selectors for better reliability
    this.complianceMenu = 'a:has-text("Compliance"), button:has-text("Compliance"), li:has-text("Compliance")';
    this.table = 'table';
    this.tableHeader = 'thead th';
    this.tableRow = 'tbody tr';
    this.complianceText = 'text="Compliance"';
    
    // Expected header texts
    this.expectedHeaders = ['Name', 'Status (Last 30 days)'];
  }

  async navigate() {
    try {
      await this.page.click(this.complianceMenu);
    } catch {
      await this.page.goto('https://dashboard.kaiterra.com/me/compliance/well-compliance-v2');
    }
    await this.page.waitForURL(/.*\/well-compliance-v2/);
  }

  async waitForTable() {
    await this.page.waitForSelector(this.table, { state: 'visible' });
  }

  async verifyTableHeaders() {
    // Wait for headers to be visible
    await this.page.waitForSelector(this.tableHeader, { state: 'visible' });
    
    // Get all header elements
    const headers = await this.page.locator(this.tableHeader).all();
    
    // Verify we have the expected number of headers
    expect(headers.length).toBeGreaterThan(0);
    
    // Verify each expected header text
    for (let i = 0; i < this.expectedHeaders.length; i++) {
      const headerText = await headers[i].textContent();
      expect(headerText?.trim()).toBe(this.expectedHeaders[i]);
    }
    
    return headers;
  }

  async verifyTableRows() {
    // Wait for table rows to be visible
    await this.page.waitForSelector(this.tableRow, { state: 'visible' });
    
    // Get all row elements
    const rows = await this.page.locator(this.tableRow).all();
    
    // Verify we have data rows
    expect(rows.length).toBeGreaterThan(0);
    
    // Verify first few rows have content
    for (let i = 0; i < Math.min(3, rows.length); i++) {
      const rowText = await rows[i].textContent();
      expect(rowText?.trim()).toBeTruthy();
      expect(rowText?.trim().length).toBeGreaterThan(0);
    }
    
    return rows;
  }

  async verifyComplianceElement() {
    await expect(this.page.locator(this.complianceText)).toBeVisible();
  }

  async verifyPageTitle() {
    const title = await this.page.title();
    expect(title).toContain('Kaiterra');
  }

  async verifyPageURL() {
    await expect(this.page).toHaveURL(/.*\/well-compliance-v2/);
  }

  async takeScreenshot(filename = 'well-compliance-verification.png') {
    await this.page.screenshot({ path: filename });
  }
}

module.exports = WellCompliance; 