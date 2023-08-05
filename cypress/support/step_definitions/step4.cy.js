import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
const tossPage = require("../../fixtures/pages/tossPage.json");

Given("userAutor logs on secretSanta login page as {string} and {string}", function(email, password) {
    cy.visit("/login");
    cy.login(email, password);
});

When("userAutor goes to box page and makes toss", function() {
    cy.readFile("inviteLinkUrl.txt").then((inviteLink) => {
    let boxLink = inviteLink.split("card?")[0];
    cy.visit(boxLink);
    });
    cy.get(tossPage.options).click({ force: true });
    cy.get(tossPage.tossOption).click({force: true});
    cy.get(tossPage.tossButton).click({force: true});
    cy.get(tossPage.tossModalWindow).should("exist");
    cy.get(tossPage.anotherTossButton).click({force: true});
});

Then("toss completed successfully", function() {
    cy.get(tossPage.resultText).should("have.text", "Жеребьевка проведена");
})