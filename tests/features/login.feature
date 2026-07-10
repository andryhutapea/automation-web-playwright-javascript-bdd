@product:saucedemo @feature:login
Feature: Login
  As a Swag Labs user, I want to log in to the application
  so that I can access the product catalog.

  Background:
    Given user is on the SauceDemo login page

  @id:TEST-001
  Scenario: Successful login with valid credentials
    When user logs in as "standard_user" with password "secret_sauce"
    Then user is redirected to the inventory page

  @id:TEST-002
  Scenario: Failed login due to a locked out account
    When user logs in as "locked_out_user" with password "secret_sauce"
    Then an error message "Epic sadface: Sorry, this user has been locked out." is displayed

  @id:TEST-003
  Scenario Outline: Failed login with invalid credentials
    When user logs in as "<username>" with password "<password>"
    Then an error message "<error_message>" is displayed

    Examples:
      | username      | password     | error_message                                                              |
      | wrong_user    | secret_sauce | Epic sadface: Username and password do not match any user in this service |
      | standard_user | wrong_pass   | Epic sadface: Username and password do not match any user in this service |
      |               | secret_sauce | Epic sadface: Username is required                                        |
      | standard_user |              | Epic sadface: Password is required                                        |
