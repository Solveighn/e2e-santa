const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const generalElements = require("../fixtures/pages/general.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const tossPage = require("../fixtures/pages/tossPage.json");

import { faker } from "@faker-js/faker";

describe("user can create a box and run it", () => {
  //пользователь 1 логинится
  //пользователь 1 создает коробку
  //пользователь 1 получает приглашение
  //пользователь 2 переходит по приглашению
  //пользователь 2 заполняет анкету
  //пользователь 3 переходит по приглашению
  //пользователь 3 заполняет анкету
  //пользователь 4 переходит по приглашению
  //пользователь 4 заполняет анкету
  //пользователь 1 логинится
  //пользователь 1 запускает жеребьевку
  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let wishes = faker.word.noun() + faker.word.adverb() + faker.word.adjective();
  let maxAmount = 50;
  let currency = "Евро";
  let inviteLink;

  it("user logins and create a box", () => {
    cy.visit("/login");
    cy.login(users.userAutor.email, users.userAutor.password);
    cy.contains("Создать коробку").click();
    cy.get(boxPage.boxNameField).type(newBoxName);
    cy.get(generalElements.arrowRight).click({ force: true });
    cy.get(boxPage.sixthIcon).click();
    cy.get(generalElements.arrowRight).click({ force: true });
    cy.get(boxPage.giftPriceToggle).check({ force: true });
    cy.get(boxPage.maxAnount).type(maxAmount);
    cy.get(boxPage.currency).select(currency);
    cy.get(generalElements.arrowRight).click({ force: true });
    cy.get(generalElements.arrowRight).click({ force: true });
    cy.get(generalElements.arrowRight).click({ force: true });
    cy.get(dashboardPage.createdBoxName).should("have.text", newBoxName);
    cy.get(".layout-1__header-wrapper-fixed .toggle-menu-item span")
      .invoke("text")
      .then((text) => {
        expect(text).to.include("Участники");
        expect(text).to.include("Моя карточка");
        expect(text).to.include("Подопечный");
      });
  });

  it("add participants", () => {
    cy.get(generalElements.submitButton).click({ force: true });
    cy.get(invitePage.inviteLink)
      .invoke("text")
      .then((link) => {
        inviteLink = link;
      });
    cy.clearCookies();
  });
  it("approve as user1", () => {
    cy.visit(inviteLink);
    cy.get(generalElements.submitButton).click({ force: true });
    cy.contains("войдите").click();
    cy.wait(500);
    cy.login(users.user1.email, users.user1.password);
    cy.wait(500);
    cy.createParticipantCard();
  });

  it("approve as user2", () => {
    cy.visit(inviteLink);
    cy.get(generalElements.submitButton).click({ force: true });
    cy.contains("войдите").click();
    cy.wait(500);
    cy.login(users.user2.email, users.user2.password);
    cy.wait(500);
    cy.createParticipantCard();
  });

  it("approve as user3", () => {
    cy.visit(inviteLink);
    cy.get(generalElements.submitButton).click({ force: true });
    cy.contains("войдите").click();
    cy.wait(500);
    cy.login(users.user3.email, users.user3.password);
    cy.wait(500);
    cy.createParticipantCard();
  });

  it("make toss", () => {
    cy.visit("/login");
    cy.login(users.userAutor.email, users.userAutor.password);
    let boxLink = inviteLink.split("card?")[0];
    cy.visit(boxLink);
    cy.get(tossPage.options).click({ force: true });
    cy.get(tossPage.tossOption).click({force: true});
    cy.get(tossPage.tossButton).click({force: true});
    cy.get(tossPage.tossModalWindow).should("exist");
    cy.get(tossPage.anotherTossButton).click({force: true});
    cy.get(tossPage.resultText).should("have.text", "Жеребьевка проведена");
  })

  it("delete box", () => {
    cy.deleteBox();
  });
});
