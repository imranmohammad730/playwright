const { test, expect } = require('@playwright/test');

// Selectors used throughout tests
const propertyDropdownSelector =
  "#__next > main > div.row-start-1.row-end-13.col-start-2.col-end-4.p-0.grid.grid-rows-11.gap-4 > " +
  "div.bg-white-50.border-\\[1px\\].border-t-\\[0px\\].border-gray-100.rounded-2xl.row-start-2.row-end-12.shadow-xl.overflow-y-scroll > " +
  "div > div > div.flex.justify-start.items-end.p-4.gap-5.border-b-\\[1px\\].border-gray-200.w-full.bg-white-50.rounded-t-2xl > " +
  "div.flex.flex-col.gap-2.grow.max-w-\\[500px\\] > div > div.relative.flex.items-center.min-h-10.rounded-md.border.border-input.text-sm.ring-offset-background.focus-within\\:ring-4.focus-within\\:ring-primary-100.focus-within\\:ring-offset-0.focus-within\\:border-primary-200.col-span-1.cursor-pointer.max-w-\\[650px\\]";

const dropdownButtonSelector =
  "#__next > main > div.row-start-1.row-end-13.col-start-2.col-end-4.p-0.grid.grid-rows-11.gap-4 > " +
  "div.bg-white-50.border-\\[1px\\].border-t-\\[0px\\].border-gray-100.rounded-2xl.row-start-2.row-end-12.shadow-xl.overflow-y-scroll > " +
  "div > div > div.p-4.flex.items-center.justify-between > div.flex.items-center.gap-4 > div > div > button:nth-child(1)";

test.describe("Demo Testing", () => {
  test.beforeEach(async ({ page }) => {
    // Set a consistent viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    // Login on every test
    await page.goto("https://staging.leni.co/login");
    await page.locator('input[name="email"]').waitFor({ state: 'visible' });
    await page.locator('input[name="email"]').fill("dev.prod.soulrooms@gmail.com");
    await page.locator('input[name="password"]').waitFor({ state: 'visible' });
    await page.locator('input[name="password"]').fill("Enjoy@247");
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/.*\/dashboard\/bookings/);
    await page.waitForTimeout(4000);
  });

  test('checks integration page for connected apps', async ({ page }) => {
    await page.goto('https://staging.leni.co/dashboard/integrations');
    await page.waitForTimeout(5000);
    await expect(page.locator('span.text-2xl.text-primary-900.font-bold', { hasText: 'Rent Manager' })).toBeVisible();
    await expect(page.locator('span.text-2xl.text-primary-900.font-bold', { hasText: 'Yardi Voyager' })).toBeVisible();
    await expect(page.locator('span.text-2xl.text-primary-900.font-bold', { hasText: 'Third Party' })).toBeVisible();
  });

  test('opens the property dropdown and selects "Select All"', async ({ page }) => {
    await page.goto('https://staging.leni.co/dashboard/analytics?page=executiveSummary');
    await page.waitForTimeout(3000);
    await page.locator(propertyDropdownSelector).click();
    const listbox = page.locator('[role="listbox"]');
    await expect(listbox).toBeVisible();
    await expect(listbox.locator('[role="option"]')).toHaveCountGreaterThan(0);
    await listbox.locator('[role="option"]', { hasText: 'Select All' }).first().click();
  });

  test("should save property filter and verify in report builder", async ({ page }) => {
    await page.goto("https://staging.leni.co/dashboard/analytics?page=executiveSummary");
    await page.waitForTimeout(5000);
    await page.locator('div.relative.flex.items-center.min-h-10.rounded-md.border.border-input').first().click();
    await page.locator('[role="listbox"]').locator('text=Select All').first().click();
    await page.locator('div[aria-haspopup="dialog"]').first().click();
    await page.locator('input[placeholder="Filter name"]').fill("Michigan Portfolio");
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(5000);
    await expect(page.locator('text=Filter saved successfully')).toBeVisible();
    await page.locator('text=Saved Filters').click();
    await page.waitForTimeout(5000);
    await expect(page.locator('text=Michigan Portfolio')).toBeVisible();

    await page.goto("https://staging.leni.co/dashboard/report-builder");
    await page.waitForTimeout(7000);
    await page.locator('svg.lucide.lucide-filter').click();
    await page.waitForTimeout(5000);
    await expect(page.locator('text=Michigan Portfolio')).toBeVisible();
  });

  test("should delete saved filters", async ({ page }) => {
    await page.goto("https://staging.leni.co/dashboard/analytics?page=executiveSummary");
    await page.waitForTimeout(5000);
    await page.locator('div[aria-haspopup="dialog"]').click();
    await page.locator('text=Saved Filters').click();
    await page.waitForTimeout(8000);
    const row = page.locator('div.flex.items-center.justify-between', { hasText: "Michigan Portfolio" });
    if (await row.first().isVisible().catch(() => false)) {
      await row.first().locator('svg.lucide-trash').click();
      const dialog = page.locator('[role="dialog"]', { hasText: "Are you sure you want to delete this filter?" });
      await expect(dialog).toBeVisible();
      await dialog.locator('button:has-text("Delete Filter")').click();
      await expect(page.locator('text=Filter deleted successfully')).toBeVisible();
    }
  });

  test('verifies header for "Executive Summary"', async ({ page }) => {
    await page.goto("https://staging.leni.co/dashboard/analytics?page=executiveSummary");
    await page.waitForTimeout(4000);
    await page.locator(dropdownButtonSelector).click();
    const listbox = page.locator('[role="listbox"]');
    await expect(listbox).toBeVisible();
    await listbox.locator('[role="option"], [role="menuitem"]', { hasText: "Executive Summary" }).click();
    const header = page.locator("h3.text-2xl.font-bold.text-primary-900");
    await expect(header).toContainText("Executive Summary");
    await page.waitForTimeout(4000);
    await expect(page.locator("span.Typewriter__wrapper")).toBeVisible();
  });

  test.skip("should setup a new Alert", async ({ page }) => {
    // migration of this alert-flow test pending
  });

  test("Creates Report with executive summary as KPI", async ({ page }) => {
    await page.goto("https://staging.leni.co/dashboard/report-builder");
    await page.locator('input[placeholder="Untitled Report"]').fill("QA Automation");
    await page.waitForTimeout(5000);
    await page.locator("div.relative.flex.items-center.min-h-10").click();
    await page.locator('input[cmdk-input]').fill("Colony Club");
    await page.waitForTimeout(4000);
    for (const label of ["Colony Club", "Ridgeline at Canton", "The Grove", "The Loop on Greenfield"]) {
      await page.locator('div', { hasText: label }).first().click();
    }
    await page.waitForTimeout(5000);
    await page.locator('div', { hasText: "Date" }).first().click();
    await page.waitForTimeout(5000);
    await page.getByRole('button', { name: 'Executive Summary' }).click();
    await page.waitForTimeout(2000);
    const boxes = await page
      .locator('[data-orientation="vertical"] button[role="checkbox"]:not(#executiveSummary-select-all)')
      .elementHandles();
    for (let i = 0; i < Math.min(20, boxes.length); i++) await boxes[i].click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Generate' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(20000);
    await expect(page.locator("div.bg-gray-25.border-none.rounded-sm.p-5")).toBeVisible();
  });

  test("should show toast when Select All is clicked", async ({ page }) => {
    await page.goto("https://staging.leni.co/dashboard/report-builder");
    await page.locator('input[placeholder="Untitled Report"]').fill("Toast Test Report");
    await page.waitForTimeout(3000);
    await page.locator("div.relative.flex.items-center.min-h-10").click();
    await page.locator('input[cmdk-input]').fill("Colony Club");
    await page.waitForTimeout(2000);
    await page.locator('div', { hasText: "Colony Club" }).first().click();
    await page.waitForTimeout(3000);
    await page.locator('div', { hasText: "Date" }).first().click();
    await page.waitForTimeout(3000);
    await page.getByRole('button', { name: 'Executive Summary' }).click();
    await page.waitForTimeout(2000);
    await page.locator('#executiveSummary-select-all').click();
    await expect(page.locator('text=You can select a maximum of 20 KPIs')).toBeVisible();
  });

  test("checks report sharing via link", async ({ page, context }) => {
    await page.goto("https://staging.leni.co/dashboard/report-builder");
    await page.evaluate(() => {
      navigator.clipboard.writeText = t => { window._cb = t; return Promise.resolve(); };
    });
    await page.waitForTimeout(5000);
    await page.getByRole('button', { name: 'Saved Reports' }).click();
    await page.waitForTimeout(3000);
    await page.locator("div.max-h-\\[250px\\].overflow-y-scroll.p-2 >> text=QA Automation").click();
    await page.waitForTimeout(4000);
    await page.locator('button[aria-haspopup="dialog"]').click();
    const dlg = page.locator('[role="dialog"]');
    await expect(dlg).toContainText("Anyone who has this link can view the data you share");
    await dlg.getByRole('button', { name: 'Copy Link' }).click();
    const link = await page.evaluate(() => window._cb);
    const share = await context.newPage();
    await share.goto(link);
    await share.locator('input[type="email"]').fill("qa.automation@bn7ukqbu.mailosaur.net");
    await share.getByRole('button', { name: 'Continue' }).click();
    await expect(share.locator('text=QA Automation')).toBeVisible();
    await share.close();
  });

  test("opens existing report from Saved Reports", async ({ page }) => {
    await page.goto("https://staging.leni.co/dashboard/report-builder");
    await page.getByRole('button', { name: 'Saved Reports' }).click();
    await page.waitForTimeout(3000);
    await page.locator("div.max-h-\\[250px\\].overflow-y-scroll.p-2 button").first().click();
    await page.waitForTimeout(3000);
    await expect(page.locator("span.text-xl.justify-self-start")).toBeVisible();
    await expect(page.locator("svg.recharts-surface")).toBeVisible();
    await expect(page.locator('button[aria-haspopup="dialog"]')).toBeVisible();
  });

  test("deletes a report successfully", async ({ page }) => {
    await page.goto("https://staging.leni.co/dashboard/report-builder");
    await page.getByRole('button', { name: 'Saved Reports' }).click();
    await page.waitForTimeout(3000);
    const row = page.locator("div.max-h-\\[250px\\].overflow-y-scroll.p-2 button", { hasText: "QA Automation" });
    await row.locator('svg.lucide-trash').click();
    const dlg = page.locator('[role="dialog"]', { hasText: "Delete Report" });
    await dlg.getByRole('button', { name: 'Delete Report' }).click();
    await expect(page.locator('text=Report deleted successfully')).toBeVisible();
    await expect(page.locator("div.max-h-\\[250px\\].overflow-y-scroll.p-2 button", { hasText: "QA Automation" })).not.toBeVisible();
  });

  test("verifies insights on Executive Summary dashboard", async ({ page }) => {
    await page.goto("https://staging.leni.co/dashboard/analytics?page=executiveSummary");
    await page.locator(dropdownButtonSelector).click();
    await page.locator('[role="listbox"]').locator('[role="option"], [role="menuitem"]', { hasText: "Executive Summary" }).click();
    await page.locator("div.flex.flex-row.w-full.items-center.justify-center.h-12.cursor-pointer.bg-accent-400.absolute.bottom-0").click();
    const card = page.locator('div.rounded-lg.border.bg-card.text-card-foreground.shadow-sm.my-4.mx-4.cursor-pointer').first();
    await expect(card.locator('div.bg-cyan-100.rounded-full.w-fit')).toContainText("Anomalies");
    await expect(card.getByRole('button', { name: 'Learn More' })).toBeVisible();
    await expect(card.locator('span', { hasText: "Focus on pet fee collections to avoid shortfall of $250k." })).toBeVisible();
    await expect(card.locator('text=Mar 25, 2025')).toBeVisible();
    await expect(card.locator('svg[class*="cursor-pointer"]')).toHaveCount(2);
  });

  test("verifies insights on Financial Performance dashboard", async ({ page }) => {
    await page.goto("https://staging.leni.co/dashboard/analytics?page=financialPerformance");
    await expect(page.locator("h3.text-2xl.font-bold.text-primary-900")).toContainText("Financial Performance");
    await page.locator("div.flex.flex-row.w-full.items-center.justify-center.h-12.cursor-pointer.bg-accent-400.absolute.bottom-0").click();
    const card = page.locator('div.rounded-lg.border.bg-card.text-card-foreground.shadow-sm.my-4.mx-4.cursor-pointer').first();
    await expect(card.locator('div.bg-cyan-100.rounded-full.w-fit')).toContainText("Anomalies");
    await expect(card.getByRole('button', { name: 'Learn More' })).toBeVisible();
    await expect(card.locator('span', { hasText: "Focus on pet fee collections to avoid shortfall of $250k." })).toBeVisible();
    await expect(card.locator('text=Mar 25, 2025')).toBeVisible();
    await expect(card.locator('svg[class*="cursor-pointer"]')).toHaveCount(2);
  });



  test("verifies that portfolio performance prompt returns canned response", async ({ page }) => {
    await page.goto("https://staging.leni.co/dashboard/analytics?page=executiveSummary");
    await page.waitForTimeout(3000);
    // Open the LeniQ chat
    await page.locator('img[alt="LeniQ Circle"]').click();
    // Chat panel should be visible
    await expect(page.locator('textarea[placeholder="Ask me anything..."]')).toBeVisible({ timeout: 10000 });
    // Verify privacy notice
    await expect(page.locator('text=Privacy first integration with LLMs.')).toBeVisible();
    await expect(page.locator('text=LLMs make mistakes, check important info')).toBeVisible();
    // Send the prompt
    await page.locator('textarea[placeholder="Ask me anything..."]').fill("Give me a brief on my portfolio performance");
    await page.locator('textarea[placeholder="Ask me anything..."]').press('Enter');
    // Wait for and verify the response
    await expect(page.locator('span.Typewriter__wrapper')).toBeVisible({ timeout: 30000 });
  });

  test("verifies that 'Give me an executive summary' prompt generates response", async ({ page }) => {
    await page.goto("https://staging.leni.co/dashboard/analytics?page=executiveSummary");
    await page.waitForTimeout(3000);
    // Open the LeniQ chat
    await page.locator('img[alt="LeniQ Circle"]').click();
    // Chat panel should be visible
    await expect(page.locator('textarea[placeholder="Ask me anything..."]')).toBeVisible({ timeout: 10000 });
    // Verify privacy notice
    await expect(page.locator('text=Privacy first integration with LLMs.')).toBeVisible();
    await expect(page.locator('text=LLMs make mistakes, check important info')).toBeVisible();
    // Send the prompt
    await page.locator('textarea[placeholder="Ask me anything..."]').fill("Give me an executive summary");
    await page.locator('textarea[placeholder="Ask me anything..."]').press('Enter');
    // Wait for and verify the response
    await expect(page.locator('span.Typewriter__wrapper')).toBeVisible({ timeout: 30000 });
  });

});  // <-- ensure this closes your test.describe block