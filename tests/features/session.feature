@product:saucedemo @feature:session
Feature: Session and navigation
  As a logged-in user, I want to be able to log out
  and reset the application state through the menu.

  Background:
    Given user is logged in as "standard_user" and on the inventory page

  @id:TEST-011
  Scenario: Logout ends the session
    When user logs out of the application
    Then user is redirected back to the login page

  @id:TEST-012
  Scenario: Reset App State clears the cart
    Given user adds the product "sauce-labs-backpack" to the cart
    When user resets the app state via the menu
    Then the cart item count is 0

  @id:TEST-013
  Scenario: Accessing the inventory page directly after logout is denied
    Given user logs out of the application
    When user opens the inventory page directly via URL
    Then user is redirected back to the login page
