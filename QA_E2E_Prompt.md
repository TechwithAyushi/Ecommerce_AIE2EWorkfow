## End-to-End QA Workflow with Natural Language
Workflow Overview

This prompt guides you through a complete 9-step QA workflow using MCP servers and AI agents to go from project structure setup and user story review to committed automated test scripts.

Rules for every step

Run tests in Chrome (chromium) only.
Complete one step fully and give a short status update before starting the next.
If a browser action does not respond within 60 seconds, mark that check as BLOCKED, note it and move on.

# STEP 1: Create the Project Folder Structure

Prompt: Create the required Playwright + TypeScript project structure for Web UI testing in the project root `e-commerceAI-E2EWorkflowQA`, using the target structure below:

```text
e-commerceAI-E2EWorkflowQA/
├── .env
├── .gitignore
├── custom-report/
├── fixtures/
├── pages/
├── prompts/
├── tests/
│   └── web/
├── testdata/
├── utils/
└── reports/
```

Requirements:

- Create only the required folders and placeholder files.
- Preserve all existing project files; do not delete or overwrite implementation files unnecessarily.
- Create `.env` and `.gitignore` only if they do not already exist.
- Follow existing project naming conventions.

Expected Output:

- Required folders and placeholder files created under `e-commerceAI-E2EWorkflowQA/`
- Existing project files preserved
- Final directory tree and a brief list of newly created files

# STEP 2: Read User Story

Prompt: I need to start a new testing workflow. Please read the user story from the file: user_stories/Saucedemo-ecommerce.md

Summarize the key requirements, acceptance criteria, and testing scope.

Expected Output:

Summary of the user story
List of acceptance criteria
Application URL and test credentials
Key features to test

# STEP 3: Create Test Plan

Prompt: Based on the user story Saucedemo-ecommerce that we just reviewed, use the playwright-test-planner agent to:

Read the application URL and test credentials from the user story
Explore the application and understand all workflows mentioned in the acceptance criteria
Create a comprehensive test plan that covers all acceptance criteria including:
Happy path scenarios
Negative scenarios (validation errors, empty fields, invalid data)
Edge cases and boundary conditions
Navigation flow tests (including browser back button)
UI element validation
Save the test plan as: specs/saucedemo-checkout-test-plan.md

Ensure each test scenario includes:

Test case ID (e.g. TC-01) and clear title
The acceptance criterion it covers (AC1–AC5)
Detailed step-by-step instructions
Expected results for each step
Test data requirements

Format the test plan using an **Application Overview** followed by **Test Scenarios**. Group related scenarios under a workflow heading. For each scenario, include a numbered title, test case ID, acceptance criteria, test data requirements, and numbered steps. Under each step, list expected results as indented `- expect:` bullets. Follow the style and structure of the supplied example; do not use tables for test steps.

Expected Output:

Complete test plan markdown file saved to specs/
Organized test scenarios with clear structure
Browser exploration screenshots (if needed)

# STEP 4: Perform Exploratory Testing

Prompt: Now I need to perform manual exploratory testing using Playwright MCP browser tools.

Please read the test plan from: specs/saucedemo-checkout-test-plan.md

Keep the browser at a desktop size of 1280x720 for all checks. Do not resize the browser.

Then execute the test scenarios defined in that plan:

Use Playwright browser tools to manually execute each test scenario from the plan
Follow the step-by-step instructions in each test case
Verify expected results match actual results
Take screenshots at key steps and error states and save them in: test-evidence/screenshots/
Document your findings in: test-evidence/exploratory-testing-results.md
Test execution results for each scenario (PASS / FAIL / BLOCKED)
Any UI inconsistencies or unexpected behaviors
Missing validations or bugs discovered
Element selectors that worked reliably
Screenshots as evidence

Expected Output:

Manual test execution results
Screenshots of the application at various states
List of observations and findings
Any issues discovered during exploration

# STEP 5: Generate Automation Scripts

Prompt: Now I need to create automated test scripts using the playwright-test-generator agent.

Please review:

Test plan from: specs/saucedemo-checkout-test-plan.md (for test scenarios and steps)
Exploratory testing results from: test-evidence/exploratory-testing-results.md (for actual element selectors and UI insights)

Using insights from the manual exploratory testing:

Leverage the element selectors and locators that were successfully used in Step 3
Use stable element properties (IDs, data-test attributes, roles) discovered during exploration
Apply wait strategies and UI behaviors observed during manual testing
Incorporate any workarounds for UI quirks discovered

Generate Playwright JavaScript automation scripts:

Create scripts for each test scenario from the test plan
Organize scripts into appropriate test suite files in: tests/web/saucedemo-checkout/
Use the test case IDs, names and steps from the test plan
Use reliable selectors and strategies from exploratory testing

Requirements for all scripts:

Follow Playwright best practices
Include proper assertions using expect()
Use descriptive test names matching the format in the test plan
Use robust element selectors discovered during manual testing
Add comments for complex steps
Use proper wait strategies based on actual application behavior (no fixed waitForTimeout)
Add proper test hooks (beforeEach, afterEach)
Run on Chrome (chromium project) only

After generating the scripts, run them once to check they execute: npx playwright test tests/web/saucedemo-checkout --project=chromium --reporter=line,allure-playwright

Expected Output:

Test suite files created in tests/web/saucedemo-checkout/ based on test plan scenarios
Scripts using robust selectors discovered during exploratory testing
All scripts follow Playwright best practices
Initial test generation complete

# STEP 6: Execute and Heal Automation Tests

Prompt: Now I need to execute the generated automation scripts and heal any failures using the playwright-test-healer agent.

Run all automation scripts: npx playwright test tests/web/saucedemo-checkout --project=chromium --reporter=line,allure-playwright
Identify any failing tests
For each failing test, use the playwright-test-healer agent to:
Analyze the failure (selector issues, timing issues, assertion failures)
Auto-heal the test by fixing selectors or adding proper waits
Update the test script with the fixes
Make at most 3 healing attempts per test. If it still fails, mark it with test.fixme() and a comment explaining why, then move on
If the failure is caused by a real application bug (the app does not meet the acceptance criteria), do NOT change the assertion to make it pass. Keep the test, mark it as a defect and record it for the report
Re-run the healed tests to verify they pass
Document:
Initial test results (pass/fail count)
Healing activities performed
Final test results after healing
Any tests that couldn't be auto-healed, and any tests failing because of real defects

Expected Output:

All automation tests executed
Failing tests identified and healed using test-healer agent
Healed test scripts updated in tests/web/saucedemo-checkout/
Final stable test execution results
Summary of healing activities performed

# STEP 7: Create Test Report

Prompt: Now I need to create a comprehensive test execution report based on manual testing, automation execution, and healing activities.

Please compile results from:

Step 4: Manual exploratory testing results (test-evidence/exploratory-testing-results.md)
Step 5: Generated automation scripts
Step 6: Automated test execution and healing results

Save the report as: test-evidence/ecommerce-checkout-test-report.md

Generate the HTML Allure report with: npm run report:allure
To open the generated report, run: npm run report:allure:open
The Allure CLI creates its default `allure-report/` output directory when generating the report; do not create a separate `allure-reports/` directory.

Include:

Executive Summary
Total test cases planned
Test cases executed (manual + automated)
Overall Pass/Fail/Blocked status
Manual Test Results
Results from Step 3 exploratory testing
Screenshots and observations (link to files in test-evidence/screenshots/)
Issues found during manual testing
Automated Test Results
Initial automation results from Step 5
Healing activities performed
Final test execution results after healing
Test suite execution summary
Pass/Fail count for each test suite
Defects Log
For any failed tests (manual or automated):
Bug ID
Severity (Critical/High/Medium/Low)
Title and Description
Steps to Reproduce
Expected vs Actual Behavior
Screenshots/Evidence
Environment Details
Test Coverage Analysis
Which acceptance criteria are covered
Coverage from manual vs automated tests
Any gaps in test coverage
Recommendations for additional testing
Summary and Recommendations
Overall quality assessment
Risk areas
Next steps

Expected Output:

Comprehensive test execution report covering both manual and automated testing
Clear PASS/FAIL status for all test scenarios
Detailed bug reports for failures
Complete test coverage analysis
Evidence and screenshots attached

# STEP 8: Refactor Tests to Page Object Model and Fixtures

Prompt: Refactor the SauceDemo checkout tests to use the Page Object Model and reusable Playwright fixtures.

Keep the current test behavior and structure:

- Keep one spec file per test case in `tests/web/saucedemo-checkout/`, named `tc-01-...spec.js` through `tc-10-...spec.js`.
- Do not weaken or remove assertions for known application defects. TC-01, TC-04, and TC-10 should continue to fail if the application still behaves as currently observed.
- Keep tests running in the Chromium project.

Create page objects in `pages/` for the relevant screens: login, products, cart, checkout information, checkout overview, and order confirmation. Page objects should encapsulate selectors and user actions; keep test assertions in the specs unless an assertion is necessary to verify a page-object navigation contract.

Create a reusable Playwright fixture in `fixtures/` that extends the base Playwright test and provides the page objects to each test. Do not automatically log in every test; some scenarios require an unauthenticated state. Keep per-test login and cart setup explicit.

For headed demonstrations, allow an optional non-negative integer `PW_TEST_PAUSE_MS` environment variable to pause after each test. Leave the pause disabled by default.

Update each spec to use the fixture and page objects. Remove `utils/checkout-test-helpers.js` only if it is no longer used. Preserve test IDs and test names.

Run and report the test results:

`npx playwright test tests/web/saucedemo-checkout --project=chromium --reporter=line,allure-playwright`

Expected Output:

- Page objects created in `pages/`.
- Reusable Playwright fixture created in `fixtures/`.
- All ten spec files updated to use the fixture and page objects.
- Existing acceptance-defect assertions remain intact.
- Pass/fail results reported and compared with the prior execution.
- Update `test-evidence/exploratory-testing-results.md` and `test-evidence/ecommerce-checkout-test-report.md` with the refactor and latest execution results.

# STEP 9: Commit to Git Repository

Prompt: Now I need to commit all the test artifacts to the Git repository using the GitHub MCP server.

Git Repository URL: https://github.com/TechwithAyushi/Ecommerce_AIE2EWorkfow

Please perform the following Git operations:

Initialize Git repository if not already initialized
Stage all new and modified files in the workspace, respecting .gitignore (do not commit node_modules/, test-results/, playwright-report/, allure-results/, allure-report/, or any tokens/secrets)
Create a commit with the message: "feat(tests): Add complete test suite for Saucedemo checkout workflow
Add user story documentation
Add comprehensive test plan with all scenarios
Add exploratory testing results and screenshots
Add test execution report with results
Add automated test scripts for checkout process
Include validation, navigation, and edge case tests
Resolves Saucedemo"
Push all changes to the Git repository
Provide a summary of what was committed

Expected Output:

All workspace files committed to Git
Descriptive commit message following conventional commit format
Confirmation of successful push to the provided repository
Summary of changes
Complete Workflow Execution

Single Combined Prompt (for Video Demo):

I want to demonstrate a complete end-to-end QA workflow using natural language and MCP servers. Run everything in Chrome (chromium) only.

STEP 1 - CREATE PROJECT STRUCTURE: Create the required `e-commerceAI-E2EWorkflowQA/` folder structure shown in Step 1, including `.env`, `.gitignore`, the Web UI test folder, pages, fixtures, prompts, testdata, utils, custom-report, and reports. Create only required folders and placeholders, preserve existing files, and report the final tree and newly created files.

STEP 2 - READ USER STORY: First, read the user story from: user_stories/Saucedemo-ecommerce.md Provide a brief summary of what needs to be tested.

STEP 3 - CREATE TEST PLAN: Use the playwright-test-planner agent to create a comprehensive test plan based on the user story. The agent should explore the application URL from the user story and cover all acceptance criteria. Save it as: specs/saucedemo-checkout-test-plan.md

STEP 4 - EXPLORATORY TESTING: Read the test plan from specs/saucedemo-checkout-test-plan.md and use Playwright browser tools (at 1280x720, no resizing) to manually execute each test scenario. Save screenshots to test-evidence/screenshots/ and findings to test-evidence/exploratory-testing-results.md.

STEP 5 - GENERATE AUTOMATION SCRIPTS: Review both the test plan and the exploratory testing results. Use the playwright-test-generator agent to create JavaScript automation scripts leveraging the element selectors and insights discovered during manual testing. Save scripts in tests/web/saucedemo-checkout/.

STEP 6 - EXECUTE AND HEAL TESTS: Run tests/web/saucedemo-checkout/ with --project=chromium. Use the playwright-test-healer agent to analyze failures and fix test-side issues (max 3 attempts per test). Do not change assertions to hide real application defects; record them instead. Document healing activities and final results.

STEP 7 - CREATE TEST REPORT: Create a comprehensive test execution report at: test-evidence/ecommerce-checkout-test-report.md Compile results from Step 4 (manual testing), Step 5 (script generation), and Step 6 (execution and healing). Include PASS/FAIL status, healing summary, defects log, and test coverage analysis. Generate the HTML Allure report using `npm run report:allure`; the CLI creates its default `allure-report/` directory.

STEP 8 - REFACTOR TO POM: Refactor the test files in tests/web/saucedemo-checkout/ to use page objects in pages/ and reusable Playwright fixtures in fixtures/. Do not auto-login every test; preserve unauthenticated coverage. Keep assertions for known defects intact. Run the Chromium suite and report results.

STEP 9 - COMMIT TO GIT: Use the GitHub MCP server to commit all new files (respecting .gitignore) with a descriptive message and push to https://github.com/TechwithAyushi/Ecommerce_AIE2EWorkfow

Execute this complete workflow and provide status updates after each step.

See task progress for longer tasks.

Track tools and referenced files used in this task.
