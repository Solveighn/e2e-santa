import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const generalElements = require("../../fixtures/pages/general.json");
const invitePage = require("../../fixtures/pages/invitePage.json");

Given("another user is on secretSanta login page", function() {
    cy.readFile("inviteLinkUrl.txt").then((inviteLink) => {
        cy.visit(inviteLink);
      });
    cy.wait(5000);
})

When("another user logs in as {string} and {string} and create a card", function(email, password) {
    cy.get(generalElements.submitButton).click({ force: true });
    cy.contains("войдите").click();
    cy.login(email, password);
    cy.wait(5000);
})

Then("another user added as participant", function() {
    cy.createParticipantCard();
    cy.clearCookies();
    cy.wait(5000);
}) 