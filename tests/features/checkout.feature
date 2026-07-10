@product:saucedemo @feature:checkout
Feature: Checkout
  As a user who has added products to the cart,
  I want to complete the checkout process.

  Background:
    Given user logs in as "standard_user"
    And user adds the product "sauce-labs-backpack" to the cart
    And user opens the cart page
    And user clicks the checkout button

  @id:TEST-008
  Scenario: Successful checkout with complete information
    When user fills in the checkout information with first name "Andry", last name "Hutapea", and zip code "12345"
    And user continues to the overview page
    And user completes the order
    Then a confirmation "Thank you for your order!" is displayed

  @id:TEST-009
  Scenario Outline: Checkout fails due to incomplete information
    When user fills in the checkout information with first name "<first_name>", last name "<last_name>", and zip code "<zip_code>"
    And user continues to the overview page
    Then an error message "<error_message>" is displayed

    Examples:
      | first_name | last_name | zip_code | error_message                  |
      |            | Hutapea   | 12345    | Error: First Name is required  |
      | Andry      |           | 12345    | Error: Last Name is required   |
      | Andry      | Hutapea   |          | Error: Postal Code is required |

  @id:TEST-010
  Scenario: The total price on the overview page is calculated correctly
    When user fills in the checkout information with first name "Andry", last name "Hutapea", and zip code "12345"
    And user continues to the overview page
    Then the total price equals the subtotal plus tax
