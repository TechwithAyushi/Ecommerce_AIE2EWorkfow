# SauceDemo E2E QA Workflow

This repository contains a browser-based QA workflow for the SauceDemo checkout application at <https://www.saucedemo.com>. It includes the user story, test plan, exploratory evidence, Playwright tests, reusable page objects and fixtures, test data, and execution reporting.

## Testing Approach

The project uses **Playwright with the Page Object Model (POM)** and reusable fixtures. The test plan is written in a BDD-style scenario format with steps and expected outcomes, but the automated tests are regular Playwright JavaScript specs—not Gherkin feature files or Cucumber scenarios. A concise description is **Playwright + POM, with BDD-style test planning**.

## Technology Stack

- **Node.js / npm** — project runtime and dependency management.
- **JavaScript (CommonJS)** — test specs, page objects, and fixtures.
- **Playwright Test** (`@playwright/test`) — browser automation and assertions.
- **Chromium** — configured browser project in `playwright.config.ts`.
- **Playwright MCP** (`@playwright/mcp`) — browser-based exploratory testing and inspection.
- **Allure** (`allure`, `allure-playwright`) — test result collection and HTML reporting.
- **GitHub Copilot in VS Code** — AI coding assistance for planning, implementation, test analysis, and documentation.

The config file uses a `.ts` extension, but the current test suite and page objects are JavaScript.

## QA Process

1. **Review requirements:** Start from [`user_stories/Saucedemo-ecommerce.md`](user_stories/Saucedemo-ecommerce.md).
2. **Plan coverage:** Document scenarios for checkout, validation, navigation, authentication, and login in [`specs/saucedemo-checkout-test-plan.md`](specs/saucedemo-checkout-test-plan.md).
3. **Explore manually:** Use Chromium browser tools to exercise the application; save screenshots and observations under [`test-evidence/`](test-evidence/).
4. **Automate:** Use the Playwright Test Generator workflow to create checkout cases in individual spec files under [`tests/web/saucedemo-checkout/`](tests/web/saucedemo-checkout/). TC-11 exercises the documented demo login accounts from [`testdata/saucedemo-login-users.json`](testdata/saucedemo-login-users.json) and is kept separately under [`tests/web/saucedemo-login/`](tests/web/saucedemo-login/).
5. **Use POM and fixtures:** Screen-specific locators and actions are in [`pages/`](pages/); shared Playwright fixtures are in [`fixtures/`](fixtures/). Tests log in explicitly where required so unauthenticated scenarios remain testable.
6. **Execute and heal:** Run the relevant test command and use the Playwright Test Healer workflow to debug failures. Fix test-side selector or timing problems, but retain assertions for confirmed product defects. Document the findings.
7. **Report:** Playwright writes Allure result files to `allure-results/`; the Allure CLI generates the HTML report in `allure-report/`.

### AI assistance and agent roles

- **GitHub Copilot in VS Code:** Assisted with the QA workflow, code changes, and documentation.
- **Playwright Test Planner:** Explored SauceDemo and refreshed the test plan.
- **Playwright Test Generator:** Exercised the planned flows and generated ten checkout specs while preserving the project's page objects and fixtures.
- **Playwright Test Healer:** Ran and debugged the checkout suite; confirmed TC-04 (invalid checkout values are accepted) and TC-10 (Finish is enabled for an empty order) are application behavior gaps, not selector or timing failures. Those assertions remain failing and documented rather than being weakened.

The Planner, Generator, and Healer workflows were used through the available chat tools. Separate custom-agent subagent launches were not used to complete the plan or tests.

## Project Layout

```text
user_stories/                     Product requirements
specs/                            Test plan
testdata/                         Reusable demo login data
pages/                            Page Object Model classes
fixtures/                         Shared Playwright fixtures
tests/web/saucedemo-checkout/     Checkout scenarios TC-01–TC-10
tests/web/saucedemo-login/        Login/logout scenario TC-11
test-evidence/screenshots/        Exploratory screenshots
test-evidence/                    Exploratory results and test report
```

## Setup and Commands

Install dependencies:

```sh
npm install
npx playwright install chromium
```

Run the checkout suite:

```sh
npx playwright test tests/web/saucedemo-checkout --project=chromium
```

Run the login suite:

```sh
npx playwright test tests/web/saucedemo-login/tc-11-login-users.spec.js --project=chromium
```

Run all Playwright tests:

```sh
npm test -- --project=chromium
```

Generate the Allure HTML report from the latest `allure-results`:

```sh
npm run report:allure
```

Open the generated report:

```sh
npm run report:allure:open
```

Generated test and report output (`test-results/`, `playwright-report/`, `allure-results/`, and `allure-report/`) is excluded from Git. The optional `PW_TEST_PAUSE_MS` environment variable can add a non-negative pause after each test for headed demonstrations; it is disabled by default.

## Current Test Notes

- The latest checkout run recorded **8 passed and 2 failed**. TC-04 preserves the validation expectation after invalid input was observed reaching the overview. TC-10 preserves the empty-cart guard expectation after the overview showed an enabled Finish button with a zero total.
- TC-01 checks the Backpack's visible `$29.99` unit price on the cart page; it does not incorrectly expect an overview subtotal there.
- TC-11 passed for all six documented demo usernames. Successful logins are followed by logout; `locked_out_user` is expected to remain on the login page with the locked-account message.
- Browser inspection did not find documented SauceDemo storefront API endpoints or commerce API traffic during the observed login/cart flow. The observed Backtrace event endpoints are telemetry, not commerce APIs, so coverage in this repository is UI-focused.
