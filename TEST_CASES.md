# Test Cases — SauceDemo (https://www.saucedemo.com/)

These test cases were compiled from manual exploration of the SauceDemo site, specifically as automation candidates with Playwright + JavaScript. Every element on the site has a stable `data-test` attribute, so nearly all test cases below are **well-suited for automation (High automation feasibility)**, except where noted otherwise.

## Test data

| Username | Behavior |
|---|---|
| `standard_user` | Works normally, used as the happy-path baseline |
| `locked_out_user` | Blocked, shows an error on login |
| `problem_user` | Broken UI (wrong/duplicate product images) |
| `performance_glitch_user` | High delay on some actions |
| `error_user` | Errors on certain interactions |
| `visual_user` | Subtle visual differences (for visual regression) |

Password for all users: `secret_sauce`

## Automation design notes (important before coding)

- **Don't use `page.goto()` to move between internal pages** after login — the cart is kept in JS state, not cookies/localStorage. Reloading/navigating directly via URL resets the cart to empty even though the login session stays active. Navigation should go through UI clicks (or through explicit verification if you're specifically testing reload behavior — see TC-CART-06).
- **The first click after page load sometimes doesn't register on the real browser** (race condition before the event listener is attached). Playwright's locators auto-wait and auto-retry actionability out of the box, so this class of flake is handled without any manual wait/sleep code.
- Use the `data-test="..."` attribute as the primary locator via XPath (`page.locator('xpath=//*[@data-test="..."]')`) — more stable than text/class.

---

## 1. Login module

| ID | Title | Precondition | Steps | Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| LOGIN-01 | Successful login with a standard user | On the login page | 1. Fill in valid username & password 2. Click Login | `standard_user` / `secret_sauce` | Redirects to `/inventory.html`, products are displayed | High |
| LOGIN-02 | Failed login — locked out user | On the login page | 1. Fill in username & password 2. Click Login | `locked_out_user` / `secret_sauce` | Stays on login page, shows error "Sorry, this user has been locked out." | High |
| LOGIN-03 | Failed login — wrong username | On the login page | 1. Fill in wrong username, correct password 2. Click Login | `wrong_user` / `secret_sauce` | Error message "Username and password do not match..." | High |
| LOGIN-04 | Failed login — wrong password | On the login page | 1. Fill in correct username, wrong password 2. Click Login | `standard_user` / `wrong_pass` | Credential mismatch error message | High |
| LOGIN-05 | Failed login — empty username | On the login page | 1. Leave username empty, fill in password 2. Click Login | — | Error message "Username is required" | Medium |
| LOGIN-06 | Failed login — empty password | On the login page | 1. Fill in username, leave password empty 2. Click Login | — | Error message "Password is required" | Medium |
| LOGIN-07 | Failed login — entirely empty form | On the login page | 1. Click Login without filling anything in | — | Error message "Username is required" | Low |
| LOGIN-08 | Login with problem_user | On the login page | 1. Log in with problem_user | `problem_user` / `secret_sauce` | Login succeeds but product images display wrong/duplicated (verify via image `src`, not manual visual check) | Medium |
| LOGIN-09 | Access a protected page without logging in | Not logged in | 1. Open `/inventory.html` directly via URL | — | Redirected/blocked back to the login page | High |

## 2. Inventory module (Product Listing)

| ID | Title | Precondition | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| INV-01 | Verify all 6 products are displayed | Logged in as standard_user | 1. Open the inventory page | Exactly 6 products, each with name, price, image, Add to cart button | High |
| INV-02 | Sort products Name (A to Z) | On the inventory page | 1. Select sort "Name (A to Z)" | Products sorted alphabetically ascending | Medium |
| INV-03 | Sort products Name (Z to A) | On the inventory page | 1. Select sort "Name (Z to A)" | Products sorted alphabetically descending | Medium |
| INV-04 | Sort products Price (low to high) | On the inventory page | 1. Select sort "Price (low to high)" | Prices sorted ascending | Medium |
| INV-05 | Sort products Price (high to low) | On the inventory page | 1. Select sort "Price (high to low)" | Prices sorted descending | Medium |
| INV-06 | Add a single product to cart | On the inventory page | 1. Click "Add to cart" on one product | Button changes to "Remove", cart badge increases by 1 | High |
| INV-07 | Add multiple products to cart | On the inventory page | 1. Click Add to cart on several different products | Cart badge = number of products added | High |
| INV-08 | Remove a product from the inventory page | Product already in cart | 1. Click "Remove" on that product | Button reverts to "Add to cart", badge decreases by 1 | High |
| INV-09 | Clicking a product name opens its details | On the inventory page | 1. Click the name/image of a product | Navigates to the matching product detail page | Medium |

## 3. Product Detail module

| ID | Title | Precondition | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| PDP-01 | Verify detail data matches listing | On the inventory page | 1. Note down a product's name & price in the listing 2. Click the product | Name, price, description on the detail page match the listing | Medium |
| PDP-02 | Add to cart from the detail page | On a product detail page | 1. Click "Add to cart" | Button changes to "Remove", cart badge increases by 1 | Medium |
| PDP-03 | Return to listing from detail page | On a product detail page | 1. Click the back/"Back to products" button | Returns to `/inventory.html` | Low |

## 4. Cart module

| ID | Title | Precondition | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| CART-01 | Verify cart items match what was added | 2 products already added | 1. Open the cart page | Name, qty, price of each item match; item count = 2 | High |
| CART-02 | Remove an item from the cart page | Item is in the cart | 1. Click "Remove" on the item | Item disappears from the list, cart badge decreases | High |
| CART-03 | Continue Shopping returns to inventory | On the cart page | 1. Click "Continue Shopping" | Returns to `/inventory.html`, cart stays populated | Medium |
| CART-04 | Checkout with an empty cart | Cart is empty | 1. Open the cart page 2. Click Checkout | Follows the site's actual behavior (proceeds to step 1 with an empty form) — document the actual result | Low |
| CART-05 | Checkout with a populated cart | At least 1 item in the cart | 1. Click Checkout | Navigates to `/checkout-step-one.html` | High |
| CART-06 | Reloading the page clears the cart (state regression) | Item is in the cart | 1. Reload/navigate again directly via URL to the cart | Cart becomes empty even though the login session stays active | Medium |

## 5. Checkout module

| ID | Title | Precondition | Steps | Data | Expected Result | Priority |
|---|---|---|---|---|---|---|
| CHK-01 | Checkout step 1 succeeds with complete data | On checkout step 1 | 1. Fill in First Name, Last Name, Zip 2. Click Continue | Andry / Hutapea / 12345 | Proceeds to `/checkout-step-two.html` | High |
| CHK-02 | Checkout step 1 fails — empty First Name | On checkout step 1 | 1. Leave First Name empty, fill in the rest 2. Click Continue | — | Error "First Name is required" | High |
| CHK-03 | Checkout step 1 fails — empty Last Name | On checkout step 1 | 1. Leave Last Name empty 2. Click Continue | — | Error "Last Name is required" | High |
| CHK-04 | Checkout step 1 fails — empty Zip | On checkout step 1 | 1. Leave Zip empty 2. Click Continue | — | Error "Postal Code is required" | High |
| CHK-05 | Cancel on checkout step 1 | On checkout step 1 | 1. Click Cancel | Returns to `/cart.html`, item is still there | Medium |
| CHK-06 | Verify overview price breakdown (subtotal, tax, total) | On checkout step 2 with known item prices | 1. Open the overview | Item total = sum of item prices; Total = Item total + Tax; recompute tax programmatically and compare | High |
| CHK-07 | Cancel on checkout step 2 | On checkout step 2 | 1. Click Cancel | Returns to `/inventory.html`, cart unchanged | Medium |
| CHK-08 | Finish checkout | On checkout step 2 | 1. Click Finish | Navigates to `/checkout-complete.html`, "Thank you for your order!" message shown | High |
| CHK-09 | Back Home from the complete page | On checkout complete | 1. Click "Back Home" | Returns to `/inventory.html`, cart badge is gone (cart already empty) | High |

## 6. Navigation / Menu / Session module

| ID | Title | Precondition | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| NAV-01 | Open the hamburger menu | Logged in | 1. Click the menu icon | Shows: All Items, About, Logout, Reset App State | Medium |
| NAV-02 | Reset App State clears the cart | Item is in the cart | 1. Open the menu 2. Click "Reset App State" | Cart badge disappears, all buttons revert to "Add to cart" | Medium |
| NAV-03 | Logout ends the session | Logged in | 1. Open the menu 2. Click Logout | Returns to the login page | High |
| NAV-04 | Access another page after logout | Logged out | 1. Try opening `/inventory.html` directly via URL | Redirects to login (invalid session) | High |
| NAV-05 | "All Items" from the menu on any page | On a non-inventory page (e.g. product detail) | 1. Open the menu 2. Click "All Items" | Returns to `/inventory.html` | Low |

## 7. Special candidates (need extra tooling / lower automation priority)

| ID | Title | Notes |
|---|---|---|
| PERF-01 | `performance_glitch_user` login time exceeds threshold | Needs an execution-duration assertion (e.g. < 5 seconds) — automatable, but prone to flakiness in CI, run separately from the main suite |
| VIS-01 | Visual regression `visual_user` vs `standard_user` | Playwright has a built-in screenshot-diff assertion (`expect(page).toHaveScreenshot()`), so this is automatable directly in this suite — still a candidate for future work, not implemented yet |
| ERR-01 | `error_user` behavior during checkout | Needs manual exploration first to pinpoint the exact error before writing a detailed test case |

---

### Priority summary for the initial suite (recommended implementation order)

1. LOGIN-01, LOGIN-02, LOGIN-03/04, LOGIN-09 — foundation & session security
2. INV-06, INV-07, INV-08 — core cart interaction
3. CART-01, CART-02, CART-05 — cart to checkout
4. CHK-01 through CHK-09 — full checkout flow (most valuable to demo as an end-to-end test)
5. NAV-02, NAV-03, NAV-04 — session & state reset
6. The rest (sorting, product detail, form edge cases) as additional regression coverage
