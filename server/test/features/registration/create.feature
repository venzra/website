@Registration @RegistrationCreate
Feature: Access a list of plans that a user will be able to subscribe to after registration

  Scenario: Required fields missing should result in an error occurring
    Given I make a POST request to the API endpoint "/api/v1/registration/create" as "registration" using:
      | invalid     |
      | bad request |
    Then there should be a 400 error from the "registration" request that contains:
      | error       |
      | Bad Request |

  Scenario: Ensure the required fields are returned correctly
    Given there is a POST consumer at "https://email.eu-west-1.amazonaws.com:443" that will return status 200
    When I make a POST request to the API endpoint "/api/v1/registration/create" as "registration" using:
      | identity                          |
      | registration-create-one@venzra.io |
    Then there should be a 200 response from the "registration" request that contains:
      | _id       | identity                          | status     | created   | updated   |
      | OBJECT_ID | registration-create-one@venzra.io | REGISTERED | DATE_TIME | DATE_TIME |

  Scenario: If an account has previously registered they can register again however they will be moved to a recovery state
    Given there is a POST consumer at "https://email.eu-west-1.amazonaws.com:443" that will return status 200
    When I make a POST request to the API endpoint "/api/v1/registration/create" as "registration" using:
      | identity                          |
      | REGISTRATION-CREATE-ONE@VENZRA.IO |
    Then there should be a 200 response from the "registration" request that contains:
      | _id       | identity                          | status   | created   | updated   |
      | OBJECT_ID | registration-create-one@venzra.io | RECOVERY | DATE_TIME | DATE_TIME |
