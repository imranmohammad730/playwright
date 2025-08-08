# Contributing to Playwright Automation Portfolio

Thank you for your interest in contributing to this Playwright automation project! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/playwright-automation.git
   cd playwright-automation
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Install Playwright browsers:
   ```bash
   npm run install-browsers
   ```

5. Set up environment variables:
   ```bash
   cp env.example .env
   # Edit .env with your test credentials
   ```

## 📝 Development Guidelines

### Code Style

- Use consistent indentation (2 spaces)
- Follow JavaScript/ES6+ best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Test Structure

- Use descriptive test names
- Group related tests using `test.describe()`
- Use `beforeEach` for common setup
- Use `afterEach` for cleanup when needed
- Follow the Page Object Model pattern

### Page Object Model

Create page objects in the `pages/` directory:

```javascript
// pages/ExamplePage.js
class ExamplePage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('[data-testid="email"]');
    this.passwordInput = page.locator('[data-testid="password"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = ExamplePage;
```

### Selectors Strategy

1. **Data attributes** (preferred): `[data-testid="element-name"]`
2. **Semantic selectors**: `button:has-text("Login")`
3. **CSS classes**: `.login-form`
4. **IDs**: `#login-button` (use sparingly)

### Environment Variables

- Never commit sensitive data
- Use environment variables for credentials
- Document new environment variables in `env.example`
- Use meaningful default values for non-sensitive data

## 🧪 Testing Guidelines

### Writing Tests

1. **Arrange**: Set up test data and conditions
2. **Act**: Perform the action being tested
3. **Assert**: Verify the expected outcome

```javascript
test('should login successfully with valid credentials', async ({ page }) => {
  // Arrange
  const loginPage = new LoginPage(page);
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  // Act
  await loginPage.login(email, password);

  // Assert
  await expect(page).toHaveURL(/.*\/dashboard/);
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
});
```

### Test Data Management

- Use fixtures for reusable test data
- Create test data factories for complex objects
- Clean up test data after tests
- Use unique identifiers to avoid conflicts

### Error Handling

- Add proper error handling in page objects
- Use try-catch blocks for optional actions
- Provide meaningful error messages
- Log important steps for debugging

## 🔧 Running Tests

### Local Development

```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Run specific test file
npx playwright test tests/example.spec.js

# Run tests with debug mode
npm run test:debug
```

### CI/CD

Tests automatically run on:
- Push to main/master branch
- Pull requests
- Multiple Node.js versions
- Multiple operating systems

## 📊 Reporting

### Test Reports

- HTML reports are generated automatically
- View reports: `npm run report`
- Reports include screenshots and videos for failed tests
- Trace files are available for debugging

### Debugging

1. Use `--debug` flag for step-by-step debugging
2. Use `--headed` flag to see browser actions
3. Check test reports for screenshots and videos
4. Use `console.log()` for debugging (will appear in test output)

## 🔒 Security

### Credentials

- Never commit real credentials
- Use environment variables for sensitive data
- Use test accounts, not production accounts
- Rotate test credentials regularly

### Data Privacy

- Don't test with real user data
- Use anonymized or synthetic test data
- Follow data protection regulations
- Clean up test data after tests

## 📝 Documentation

### Code Documentation

- Add JSDoc comments for complex functions
- Document page object methods
- Explain business logic in comments
- Keep README.md updated

### Test Documentation

- Document test scenarios and business requirements
- Explain test data setup
- Document known issues and workarounds
- Keep test descriptions up to date

## 🤝 Pull Request Process

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write tests for new functionality
   - Update documentation
   - Follow coding guidelines

3. **Test your changes**:
   ```bash
   npm test
   npm run test:headed  # Visual verification
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new test for user registration"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**:
   - Provide a clear description
   - Reference related issues
   - Include screenshots if UI changes
   - Ensure all tests pass

### Commit Message Format

Use conventional commit format:

```
type(scope): description

feat: add new test for user registration
fix: resolve timeout issue in login test
docs: update README with new setup instructions
test: add visual regression test for dashboard
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Test-related changes
- `refactor`: Code refactoring
- `chore`: Maintenance tasks

## 🐛 Issue Reporting

When reporting issues:

1. **Check existing issues** first
2. **Provide detailed information**:
   - Test file and line number
   - Error message
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node.js version, etc.)

3. **Include relevant files**:
   - Test file
   - Screenshots/videos
   - Console output
   - Trace files

## 📞 Getting Help

- Check the [Playwright documentation](https://playwright.dev/)
- Review existing issues and discussions
- Ask questions in the project discussions
- Join the Playwright community

## 🎯 Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the project's coding standards

Thank you for contributing to this project! 🚀
