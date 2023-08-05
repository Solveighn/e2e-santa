import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const generalElements = require("../../fixtures/pages/general.json");
const invitePage = require("../../fixtures/pages/invitePage.json");
let inviteLink;

Given("userAutor is on box page", function() {
    cy.get(generalElements.submitButton).click({ force: true });
});

When("userAutor adds participants and saves invite link", function() {
    cy.get(invitePage.inviteLink)
    .invoke("text")
    .then((link) => {
      inviteLink = link;
      cy.writeFile("inviteLinkUrl.txt", link)
    });
});

Then("users get invite link", function () {
    cy.clearCookies();
    cy.setCookie('linkUrl', inviteLink);
    cy.getCookie('linkUrl')
    .should('have.property', 'value')
    .then((cookie) => {
        cy.log(cookie)
    })
  });