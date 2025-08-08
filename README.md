# Playwright Automation Portfolio

A comprehensive end-to-end testing automation framework built with Playwright for web application testing. This project demonstrates advanced automation techniques including UI testing, API testing, and visual regression testing.

## 🚀 Features

- **End-to-End Testing**: Complete user journey testing with realistic scenarios
- **Cross-Browser Testing**: Support for Chromium, Firefox, and WebKit
- **Visual Testing**: Screenshot comparison and visual regression testing
- **API Testing**: REST API endpoint validation
- **CI/CD Ready**: Configured for GitHub Actions and other CI platforms
- **Page Object Model**: Organized test structure with reusable components
- **Custom Fixtures**: Shared test utilities and data management
- **Parallel Execution**: Optimized for fast test execution
- **Detailed Reporting**: HTML and JSON test reports

## 🛠️ Tech Stack

- **Playwright**: Modern web testing framework
- **Node.js**: JavaScript runtime
- **GitHub Actions**: CI/CD pipeline
- **HTML Reporter**: Detailed test reports

## 📁 Project Structure

```
playwright-automation/
├── tests/                    # Test files
│   ├── WELL.spec.js         # Main application tests
│   ├── demo.spec.js         # Demo tests
│   └── practice.spec.js     # Practice scenarios
├── pages/                   # Page Object Models
│   ├── KaiterraLogin.js     # Login page object
│   └── WellCompliance.js    # Compliance page object
├── fixtures/                # Test data and utilities
├── utils/                   # Helper functions
├── playwright.config.js     # Playwright configuration
└── package.json            # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/playwright-automation.git
cd playwright-automation
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npm run install-browsers
```

### Running Tests

#### Run all tests:
```bash
npm test
```

#### Run tests in headed mode (with browser UI):
```bash
npm run test:headed
```

#### Run tests with UI mode:
```bash
npm run test:ui
```

#### Run tests in debug mode:
```bash
npm run test:debug
```

#### View test reports:
```bash
npm run report
```

## 📊 Test Scenarios

### WELL Compliance Dashboard Tests
- **Header Verification**: Validates all header elements and navigation
- **Table Functionality**: Tests data table interactions and search
- **Report Creation**: End-to-end report generation workflow
- **Modal Interactions**: Tests disclaimer modal and form interactions
- **Data Validation**: Verifies data accuracy and calculations
- **Export Functionality**: Tests report export capabilities

### Demo Tests
- **Basic Navigation**: Simple page navigation tests
- **Form Interactions**: Input field and form submission testing
- **API Integration**: Backend API endpoint validation

## 🔧 Configuration

The project uses a comprehensive Playwright configuration (`playwright.config.js`) with:

- **Parallel Execution**: Tests run in parallel for faster execution
- **Retry Logic**: Automatic retry on CI environments
- **Timeout Management**: Optimized timeouts for different environments
- **Browser Configuration**: Cross-browser testing setup
- **Reporting**: HTML and JSON report generation

## 📈 CI/CD Integration

The project includes GitHub Actions workflow for automated testing:

- **Trigger**: Runs on push to main branch and pull requests
- **Matrix Testing**: Tests across multiple Node.js versions
- **Browser Installation**: Automatic browser setup
- **Test Execution**: Parallel test execution
- **Artifact Upload**: Test reports and screenshots uploaded as artifacts

## 🎯 Key Testing Patterns

### Page Object Model
```javascript
// Example from pages/KaiterraLogin.js
class KaiterraLogin {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### Custom Fixtures
```javascript
// Example from fixtures/customFixtures.js
const { test as base } = require('@playwright/test');

const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Setup authentication
    await page.goto('/login');
    await page.fill('[data-testid="email"]', process.env.TEST_EMAIL);
    await page.fill('[data-testid="password"]', process.env.TEST_PASSWORD);
    await page.click('[data-testid="login-button"]');
    await use(page);
  },
});
```

## 📝 Best Practices Implemented

1. **Environment Variables**: Sensitive data stored in environment variables
2. **Test Data Management**: Centralized test data and fixtures
3. **Error Handling**: Comprehensive error handling and logging
4. **Selectors Strategy**: Robust element selection strategies
5. **Test Organization**: Logical test grouping and naming conventions
6. **Documentation**: Comprehensive inline documentation

## 🔒 Security

- No hardcoded credentials in test files
- Environment variables for sensitive data
- Secure handling of API keys and tokens
- Proper cleanup of test data

## 📊 Performance

- Parallel test execution
- Optimized selectors for faster element location
- Efficient page object model implementation
- Minimal test dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **GitHub**: [@yourusername](https://github.com/yourusername)
- **LinkedIn**: [Your Name](https://linkedin.com/in/yourprofile)
- **Portfolio**: [your-portfolio.com](https://your-portfolio.com)

---

⭐ **Star this repository if you find it helpful!**
