# automation-web-playwright-javascript

BDD automation tests (Playwright + [playwright-bdd](https://github.com/vitalets/playwright-bdd)) for the [SauceDemo](https://www.saucedemo.com/) site. The reference test cases live in [TEST_CASES.md](TEST_CASES.md).

This is a Playwright + JavaScript reimplementation of the [automation-web-selenium-python-bdd](../automation-web-selenium-python-bdd) suite — same scenarios, same Gherkin `.feature` files (copied verbatim, BDD text is implementation-agnostic), different stack.

## Project structure

```
config.js                  # base URL & user data
playwright.config.js
global-setup.js             # auto-runs bddgen before every test run (see "Running the tests" below)
reporters/
  local-report-server.reporter.js   # prints a clickable URL to the last HTML report after every run
  report-server.js                    # the static file server it spawns (detached, reused across runs)
tests/
  pages/                     # Page Object Model
    base.page.js
    login.page.js           + login.page.locators.js     # locators kept separate from the page object, one file per page
    inventory.page.js       + inventory.page.locators.js
    cart.page.js            + cart.page.locators.js
    checkout.page.js        + checkout.page.locators.js   # 3 classes: StepOne / StepTwo / Complete
  features/                 # Gherkin scenarios (.feature)
    login.feature
    cart.feature
    checkout.feature
    session.feature
  step_defs/                 # playwright-bdd step definitions
    pages.fixture.js           # Playwright test.extend() with a fixture per page object
    bdd.js                     # createBdd(test) shared by every *.steps.js file
    common.steps.js            # steps shared by 2+ features (see note below)
    login.steps.js
    cart.steps.js
    checkout.steps.js
    session.steps.js
```

## Setup

Requires Node.js 20+.

```bash
npm install
npx playwright install chromium
```

## Running the tests

```bash
npm test                                   # headless, all scenarios
npm run test:headed                       # visible browser
npm run test:ui                           # Playwright UI mode (interactive runner)
npx playwright test tests/features/login.feature   # a single feature only
npx playwright test -g "checkout"         # filter by scenario/test title
```

playwright-bdd needs a build step (`bddgen`) to turn `.feature` files into runnable specs before Playwright can find them. That step runs automatically via `globalSetup` in `playwright.config.js` — no matter how you invoke it (`npm test`, bare `npx playwright test`, with `--grep`, ...), it's always regenerated fresh first. There's no separate command to remember.

### Running by tag (ID / Feature / Product)

Every feature file is tagged with `@product:...` and `@feature:...` at the Feature level, and `@id:TEST-NNN` on each Scenario/Scenario Outline. playwright-bdd turns these into regular Playwright test tags, filterable with `--grep`:

```bash
npx playwright test --grep "@id:TEST-009"        # run one specific test case by ID
npx playwright test --grep "@feature:cart"       # run all test cases in one feature
npx playwright test --grep "@product:saucedemo"  # run every test case for this product
```

Full ID list and its mapping to each scenario:

| ID | Feature | Scenario |
|---|---|---|
| TEST-001 | login | Successful login with valid credentials |
| TEST-002 | login | Failed login due to a locked out account |
| TEST-003 | login | Failed login with invalid credentials (outline) |
| TEST-004 | cart | Add a single product to the cart |
| TEST-005 | cart | Add multiple products to the cart |
| TEST-006 | cart | Remove a product from the cart on the inventory page |
| TEST-007 | cart | Added item is displayed correctly on the cart page |
| TEST-008 | checkout | Successful checkout with complete information |
| TEST-009 | checkout | Checkout fails due to incomplete information (outline) |
| TEST-010 | checkout | The total price on the overview page is calculated correctly |
| TEST-011 | session | Logout ends the session |
| TEST-012 | session | Reset App State clears the cart |
| TEST-013 | session | Accessing the inventory page directly after logout is denied |

## Running tests in parallel

Playwright parallelizes by default — control the number of concurrent workers with `--workers`:

```bash
npx playwright test --workers=4
npx playwright test --workers=8
```

Each worker gets its own browser context, so tests stay isolated and safe to run concurrently — no extra plugin needed (unlike `pytest-xdist` in the Python version).

**Retries**: for high parallelism / flaky infrastructure, use `--retries`:

```bash
npx playwright test --workers=4 --retries=2
```

This retries a failing test up to 2 times before reporting it as failed, same intent as `pytest-rerunfailures` in the Python suite. `retries` is already set to `2` automatically when `CI=true` (see `playwright.config.js`).

## Report

No Allure setup is needed here — Playwright's built-in HTML reporter and trace viewer cover the same ground. Both the HTML report and failure artifacts (screenshots/traces) are consolidated under a single `reports/` folder (`outputDir` and the `html` reporter's `outputFolder` are both pointed there in `playwright.config.js`):

```bash
npm test              # generates reports/html/ and reports/test-results/ automatically
```

A custom reporter (`reporters/local-report-server.reporter.js`) prints a clickable link to the report at the end of every run — no separate `show-report` step needed:

```
--------------------------------- Playwright report ---------------------------------
http://localhost:9323/index.html
```

It works the same way the Allure server did in the Python version: the first run spawns a small static file server (detached, `reporters/report-server.js`) on port `9323` and leaves it running; subsequent runs detect the port is already open and just reuse it, so the same link keeps serving the latest report. Manual generation still works if you prefer it: `npx playwright show-report reports/html` (or `npm run report`).

Every test automatically records a trace and a screenshot on failure (`trace: 'retain-on-failure'` and `screenshot: 'only-on-failure'` in `playwright.config.js`) — open a failed test in the HTML report and click "trace" to step through it action-by-action, DOM snapshots included.

`reports/`, `blob-report/`, and `.features-gen/` (playwright-bdd's generated intermediate specs) are already in `.gitignore` — generated artifacts, no need to commit.

## Notes

- All locators use the `xpath=` or `id=` Playwright locator engine only (no CSS selectors) — same constraint as the Selenium version's `By.XPATH`/`By.ID`, defined separately from the page object in a `*.page.locators.js` file under `tests/pages/`. `data-test`/`class` attributes go through XPath (`page.locator('xpath=//*[@data-test="..."]')`); the sidebar menu links (which only have a plain `id`) go through `page.locator('id=...')`.
- No `BasePage.click()`/explicit-wait wrapper is needed (unlike the Selenium version) — Playwright locators auto-wait and auto-retry actionability checks natively, which is exactly the workaround the Python `BasePage` had to hand-roll for the "first click after page load doesn't register" issue.
- The cart is kept in JS state (SPA), not cookies/localStorage — avoid `page.goto()` straight to an internal page if you want to keep the cart contents.
- `tests/step_defs/common.steps.js` holds step definitions reused by 2+ feature files (e.g. `user is logged in as "..." and on the inventory page`, `user adds the product "..." to the cart`, `an error message "..." is displayed`). Cucumber's `Given`/`When`/`Then` keywords are cosmetic — a step registered once matches regardless of which keyword the `.feature` file uses, so these are defined exactly once to avoid ambiguous-step errors.
- Scenarios for `problem_user`, `performance_glitch_user`, `error_user`, and `visual_user` aren't implemented yet (see the "Special candidates" section in TEST_CASES.md) — candidates for future work.
- Gherkin doesn't allow tags (`@...`) above `Background:` — only above `Feature`, `Scenario`, `Scenario Outline`, and `Examples`. When adding a new Scenario, put the `@id:TEST-NNN` tag (continuing the numbering) above the Scenario itself, not on the Background.
