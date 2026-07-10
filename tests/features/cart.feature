@product:saucedemo @feature:cart
Feature: Shopping cart
  As a logged-in user, I want to add and remove
  products from the cart.

  Background:
    Given user is logged in as "standard_user" and on the inventory page

  @id:TEST-004
  Scenario: Add a single product to the cart
    When user adds the product "sauce-labs-backpack" to the cart
    Then the cart item count is 1

  @id:TEST-005
  Scenario: Add multiple products to the cart
    When user adds the product "sauce-labs-backpack" to the cart
    And user adds the product "sauce-labs-bike-light" to the cart
    And user adds the product "sauce-labs-onesie" to the cart
    Then the cart item count is 3

  @id:TEST-006
  Scenario: Remove a product from the cart on the inventory page
    Given user adds the product "sauce-labs-backpack" to the cart
    When user removes the product "sauce-labs-backpack" from the cart
    Then the cart item count is 0

  @id:TEST-007
  Scenario: Added item is displayed correctly on the cart page
    Given user adds the product "sauce-labs-backpack" to the cart
    When user opens the cart page
    Then the product "Sauce Labs Backpack" is displayed on the cart page
