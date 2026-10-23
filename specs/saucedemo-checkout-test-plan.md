# SauceDemo Checkout and Login Test Plan

## Application Overview

Application Overview: Test SauceDemo at https://www.saucedemo.com in Chromium. Requirements and AC1–AC5 are in user_stories\Saucedemo-ecommerce.md; demo users/password are documented on the login page and listed in testdata\saucedemo-login-users.json. Start each scenario with a fresh browser context unless setup is specified. Live exploration confirms login reaches Products; cart rows show product details and unit price but no cart subtotal; checkout information requires first name, last name, and postal code; valid checkout reaches Overview with order/payment/shipping/totals; successful order completion clears the cart. Existing evidence shows invalid special-character names/non-numeric postal text were accepted and empty-cart Overview presented $0 totals with Finish enabled. Record these as current behavior that conflicts with intended criteria, not as desired expectations. Allowed name characters, postal formats, and field lengths are unspecified and require product clarification. Key selectors observed: [data-test=username/password/login-button], add-to-cart data-test selectors, [data-test=shopping-cart-link], [data-test=checkout], [data-test=firstName/lastName/postalCode/continue], .cart_item, .summary_subtotal_label, .summary_tax_label, .summary_total_label, [data-test=cancel/finish/back-to-products], and #react-burger-menu-btn / [data-test=logout-sidebar-link].

## Test Scenarios

### 1. SauceDemo Checkout Workflow

**Seed:** `tests\seed.spec.ts`

#### 1.1. TC-01 Cart review shows item details, unit price, quantity, and navigation controls (AC1; data: standard_user, secret_sauce, Backpack $29.99)

**File:** `tests\web\saucedemo-checkout\tc-01-cart-review.spec.js`

**Steps:**
  1. Log in using the demo credentials, add Sauce Labs Backpack, and open Cart.
    - expect: Products page appears after login; cart badge shows 1.
    - expect: Cart displays Backpack name, description, quantity 1, and unit price $29.99.
  2. Inspect Cart navigation and price summary.
    - expect: Continue Shopping and Checkout are visible and usable.
    - expect: The screenshot shows no subtotal/total on Cart; preserve this as an AC1 observation. Do not incorrectly assert the overview subtotal on Cart.

#### 1.2. TC-02 Continue Shopping preserves cart contents (AC1; data: standard_user, secret_sauce, Backpack)

**File:** `tests\web\saucedemo-checkout\tc-02-continue-shopping.spec.js`

**Steps:**
  1. Log in, add Backpack, open Cart, and click Continue Shopping.
    - expect: Products page is displayed and cart badge remains 1.
  2. Open Cart again.
    - expect: Backpack remains in cart with quantity and item details unchanged.

#### 1.3. TC-03 Checkout form reports missing required fields (AC2; data: one cart item, partial and valid Taylor/QA/90210 values)

**File:** `tests\web\saucedemo-checkout\tc-03-required-checkout-fields.spec.js`

**Steps:**
  1. Log in, add one item, open Cart, and click Checkout.
    - expect: Checkout information page shows First Name, Last Name, Zip/Postal Code, Cancel, and Continue.
  2. Submit all fields empty, then enter fields progressively while leaving the next required value blank.
    - expect: Each attempt remains on checkout information and identifies the next missing required field.
    - expect: Values already entered remain available as observed; each mandatory field blocks progression until supplied.

#### 1.4. TC-04 Invalid and boundary checkout input is validated (AC5; data: !!!, ###, abc, whitespace, boundaries, and Taylor/QA/90210)

**File:** `tests\web\saucedemo-checkout\tc-04-invalid-checkout-data.spec.js`

**Steps:**
  1. Reach checkout information with one item; submit first name !!!, last name ###, postal code abc.
    - expect: AC5 expects invalid data feedback and prohibits proceeding.
    - expect: Existing screenshot shows these values were accepted and reached Overview; document as an app behavior gap, not expected success.
  2. Probe whitespace-only inputs and representative name/postal boundaries after confirming expected validation policy.
    - expect: Whitespace-only required values are rejected.
    - expect: Record behavior for other boundaries without inventing rules: allowed characters, postal formats, and lengths are not specified in the story.
  3. Enter Taylor, QA, 90210 and continue.
    - expect: Valid values reach Overview.

#### 1.5. TC-05 Valid checkout displays complete order overview (AC3; data: Backpack $29.99 and Taylor/QA/90210)

**File:** `tests\web\saucedemo-checkout\tc-05-valid-checkout-overview.spec.js`

**Steps:**
  1. Add Backpack, proceed to checkout, enter valid customer information, and continue.
    - expect: Overview shows Backpack, quantity 1, unit price $29.99, payment and shipping information, and Cancel/Finish controls.
    - expect: Item total is $29.99, tax $2.40, and total $32.39.

#### 1.6. TC-06 Multi-item totals are calculated correctly (AC3; data: Backpack $29.99 and Bike Light $9.99)

**File:** `tests\web\saucedemo-checkout\tc-06-multi-item-totals.spec.js`

**Steps:**
  1. Add Backpack and Bike Light; continue through checkout with valid details.
    - expect: Both products appear in Overview.
    - expect: Subtotal $39.98, tax $3.20, and total $43.18; subtotal plus tax equals total.

#### 1.7. TC-07 Cancel checkout preserves cart and does not submit order (AC2 and AC3; data: one item and valid customer information)

**File:** `tests\web\saucedemo-checkout\tc-07-cancel-checkout.spec.js`

**Steps:**
  1. From checkout information, click Cancel.
    - expect: Returns to Cart and retains item; order is not completed.
  2. Re-enter checkout, continue to Overview, and click Cancel.
    - expect: Returns to Products, cart remains populated, and no confirmation is displayed.

#### 1.8. TC-08 Browser Back and Forward navigation remains usable (AC2, AC3, technical note; data: one item and valid customer information)

**File:** `tests\web\saucedemo-checkout\tc-08-browser-back-forward.spec.js`

**Steps:**
  1. Reach Overview, use browser Back, then browser Forward.
    - expect: Checkout information and Overview load with consistent item/cart state.
    - expect: Exploration observed fields cleared on Back; story does not specify whether fields should persist.
  2. In a separate flow, go Back from Cart to Products.
    - expect: Products loads and cart state remains consistent.

#### 1.9. TC-09 Finish confirms order and clears cart (AC4, business rule 2; data: one item and valid customer information)

**File:** `tests\web\saucedemo-checkout\tc-09-order-completion.spec.js`

**Steps:**
  1. Reach Overview with a populated cart and valid details; click Finish once.
    - expect: Checkout complete page displays success confirmation and Back Home.
  2. Click Back Home and reopen Cart.
    - expect: Products page loads and the completed order's cart is empty.

#### 1.10. TC-10 Authentication protects checkout and empty cart cannot be completed (business rule 1; data: signed-out context, signed-in empty cart, populated cart)

**File:** `tests\web\saucedemo-checkout\tc-10-authentication-empty-cart.spec.js`

**Steps:**
  1. While signed out, navigate directly to Cart and checkout information URLs.
    - expect: Protected cart/checkout is denied or redirects to login.
  2. Sign in with an empty cart and proceed to Overview if controls permit; do not submit the empty order.
    - expect: Intended behavior is to prevent completion of a zero-item order.
    - expect: Existing evidence shows empty Overview with zero totals and Finish enabled; record as a behavior gap.
  3. Add an item and follow normal checkout.
    - expect: Authenticated checkout works with a populated cart.

### 2. SauceDemo Login Workflow

**Seed:** `tests\seed.spec.ts`

#### 2.1. TC-11 Login and logout with documented demo users (business rule 1; data: testdata\saucedemo-login-users.json)

**File:** `tests\web\saucedemo-login\tc-11-login-users.spec.js`

**Steps:**
  1. For each username in the test data, submit its shared password on the login page.
    - expect: standard_user, problem_user, performance_glitch_user, error_user, and visual_user reach Products.
    - expect: locked_out_user remains on Login and displays the locked-account message.
  2. For each successful account, open the navigation menu and click Logout.
    - expect: Returns to Login; username input is visible and the user is signed out.
