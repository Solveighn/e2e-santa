// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const loginPage = require("../fixtures/pages/loginPage.json");
const generalElements = require("../fixtures/pages/general.json");
const inviteeBoxPage = require("../fixtures/pages/inviteeBoxPage.json");
const inviteeDashboardPage = require("../fixtures/pages/inviteeDashboardPage.json");
import { faker } from "@faker-js/faker";

let wishes = faker.word.noun() + faker.word.adverb() + faker.word.adjective();

Cypress.Commands.add("login", (userName, password) => {
  cy.get(loginPage.loginField).type(userName);
  cy.get(loginPage.passwordField).type(password);
  cy.get(generalElements.submitButton).click({ force: true });
});

Cypress.Commands.add("createParticipantCard", () => {
  cy.contains("Создать карточку участника").should("exist");
  cy.get(generalElements.submitButton).click({ force: true });
  cy.wait(500);
  cy.get(generalElements.arrowRight).click({ force: true });
  cy.wait(500);
  cy.get(generalElements.arrowRight).click({ force: true });
  cy.wait(500);
  cy.get(inviteeBoxPage.wishesInput).type(wishes);
  cy.get(generalElements.arrowRight).click({ force: true });
  cy.wait(500);
  cy.get(inviteeDashboardPage.noticeForInvitee)
    .invoke("text")
    .then((text) => {
      expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
    });
});

Cypress.Commands.add("deleteBox", () => {
cy.visit("/login");
cy.login(users.userAutor.email, users.userAutor.password);
cy.wait(2000);
cy.get(
  '.layout-1__header-wrapper-fixed > .layout-1__header > .header > .header__items > .layout-row-start > [href="/account/boxes"] > .header-item > .header-item__text > .txt--med'
).click({ force: true });
cy.wait(1000);
cy.get("#root > div.layout-1 > section.layout-1__main-wrapper > div.layout-1__main > section > div:nth-child(2) > div > div.MuiGrid-root.MuiGrid-container.MuiGrid-spacing-xs-2 > div > div > div:nth-child(1) > a > div > div.user-card__info-wrapper > div.user-card__name > span").click({ force: true });
cy.wait(500);
cy.get(
  ".layout-1__header-wrapper-fixed > .layout-1__header-secondary > .header-secondary > .header-secondary__right-item > .toggle-menu-wrapper > .toggle-menu-button > .toggle-menu-button--inner"
).click({ force: true });
cy.wait(500);
cy.contains("Архивация и удаление").click({ force: true });
cy.get("#root > div.layout-1 > section.layout-1__main-wrapper > div.layout-1__main > section > div > section > div > div > div.form-page__main > div:nth-child(2) > div.form-page-group__main > div.frm-wrapper > input").type(
  "Удалить коробку"
);
cy.get(".btn-service").click({ force: true });
});
