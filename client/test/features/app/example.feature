@Example
Feature: Example feature file

  Scenario: Check the site loads
    Given I navigate to the "/" page
    Then the browser title should be "Venzra :: Commerce"
    And there is an h2 element that contains the text "Pricing"
    And there is an h2 element that contains the text "Loyalty"
    And there is an h2 element that contains the text "Platform features"
