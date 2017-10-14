@Registration @RegistrationCreate
Feature: Access a list of plans that a user will be able to subscribe to after registration

  Scenario: Required fields missing should result in an error occurring
    Given I make a POST request to the API endpoint "/api/v1/registration/create" as "registration" using:
      | invalid     |
      | bad request |
    Then The response from the "registration" request should be a 400 error that contains:
      | error       |
      | Bad Request |

  Scenario: Ensure the required fields are returned correctly
    Given There is a "POST" consumer at "https://email.eu-west-1.amazonaws.com:443" that will return status 200
    When I make a POST request to the API endpoint "/api/v1/registration/create" as "registration" using:
      | identity               |
      | registration@venzra.io |
    Then The response from the "registration" request contains:
      | _id       | identity               | status     | created   | updated   |
      | OBJECT_ID | registration@venzra.io | REGISTERED | DATE_TIME | DATE_TIME |

  Scenario: If an account has previously registered they can register again however they will be moved to a recovery state
    Given There is a "POST" consumer at "https://email.eu-west-1.amazonaws.com:443" that will return status 200
    When I make a POST request to the API endpoint "/api/v1/registration/create" as "registration" using:
      | identity               |
      | REGISTRATION@VENZRA.IO |
    Then The response from the "registration" request contains:
      | _id       | identity               | status   | created   | updated   |
      | OBJECT_ID | registration@venzra.io | RECOVERY | DATE_TIME | DATE_TIME |
