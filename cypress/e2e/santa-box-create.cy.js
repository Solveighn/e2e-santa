const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const generalElements = require("../fixtures/pages/general.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const tossPage = require("../fixtures/pages/tossPage.json");

import { faker } from "@faker-js/faker";

describe("user can create a box and run it", () => {

  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let maxAmount = 50;
  let currency = "Евро";
  let inviteLink;
  let santaCookie = "jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMwMDE0NDYsImlhdCI6MTY5MDQ4ODQxMiwiZXhwIjoxNjkwNDkyMDEyfQ.NbjdZphYDZJcLkMWI3ciJ7ha5QSnVnWIWvIPTAMm8pg; Max-Age=3600; Path=/; Expires=Thu, 27 Jul 2023 21:06:52 GMT; HttpOnly";

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
    cy.login(users.user1.email, users.user1.password);
    cy.createParticipantCard();
  });

  it("approve as user2", () => {
    cy.visit(inviteLink);
    cy.get(generalElements.submitButton).click({ force: true });
    cy.contains("войдите").click();
    cy.login(users.user2.email, users.user2.password);
    cy.createParticipantCard();
  });

  it("approve as user3", () => {
    cy.visit(inviteLink);
    cy.get(generalElements.submitButton).click({ force: true });
    cy.contains("войдите").click();
    cy.login(users.user3.email, users.user3.password);
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
  });

  after ("delete box", () => {
    let boxLink = inviteLink.split("/card?")[0];
    let boxArray = boxLink.split("/");
    let boxId = boxArray[boxArray.length - 1];
    cy.request({
        method: "DELETE",
        headers: {
            Cookie: santaCookie
        },
        url: "/" +"api/box/" + boxId
    }).then((response) => {

        expect(response.status).to.equal(200);
    })        
})
});
