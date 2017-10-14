@Registration @RegistrationPlans
Feature: Access a list of plans that a user will be able to subscribe to after registration

  Scenario: Ensure the required fields are returned correctly
    Given I make a GET request to the API endpoint "/api/v1/registration/plans" as "plans"
    Then The response path "list" from the "plans" request contains:
      | name                     | currency | symbol | units | quantity | value | fee | fraction |
      | United Kingdom           | GBP      | £      | p     | 10       | 80    | 25  | 100      |
      | United States of America | USD      | $      | ¢     | 10       | 100   | 30  | 100      |
