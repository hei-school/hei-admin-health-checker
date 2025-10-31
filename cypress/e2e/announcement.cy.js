import { loopTab } from './utils.js'
const user_tabs = {
  admin_tabs: [
    "Tous",
    "Managers uniquement",
    "Étudiants uniquement",
    "Enseignants uniquement",
  ],
  teacher_tabs: ["Tous", "Tout le monde", "Enseignants uniquement"],
  student_tabs: ["Tous", "Tout le monde", "Étudiants uniquement"],
};


const checkAnnouncement = (tabs, user) => {
  cy.loginAs(user);
  cy.contains("Annonces").should("be.visible").click();
  loopTab(tabs);
  cy.contains(tabs[0]).click();
  cy.get('[data-testid="letter-list-wrapper"]').within(() => {
    cy.get(".MuiCard-root").first().click();
  });
  cy.get(".MuiCheckbox-root").first().should("be.visible").click();
  cy.contains("Réaction mise à jour avec succès").should("be.visible");
  cy.get(".MuiCheckbox-root").first().click();
}


const createAnnoucement = (creator, option) => {
  const date = new Date();
  const annoucement = `Test annonces pour tous le monde par ${creator} le ${date.toString()}`;
  const title = `${creator} annonce test`;
  cy.get('#ha-menu div.css-tm1l5h').click();
  cy.get('[data-testid="menu-list-action"] button.css-1yxmbwk').click();
  cy.get('[data-testid="create-button"]').click();
  cy.get('[name="title"]').click();
  cy.get('[name="title"]').type(title);
  cy.get('#scope').click()
  cy.get('[role="listbox"]').contains(option).click()
  cy.get('.toastui-editor-ww-container')
    .click()
    .type(annoucement);
  cy.get('button.css-15n29yk').click();
  cy.contains("Élément créé").should("be.visible")
}

describe("annoucement test", () => {
  it("test annoucement as an admin", () => {
    checkAnnouncement(user_tabs.admin_tabs, "ADMIN");
    createAnnoucement("ADMIN", "Tout le monde");
  });
  it("connect as a teacher", () => {
    checkAnnouncement(user_tabs.teacher_tabs, "TEACHER")
  });
  it("connect as a student", () => {
    checkAnnouncement(user_tabs.student_tabs, "STUDENT")
  }),
    it("connect as a manager", () => {
      checkAnnouncement(user_tabs.admin_tabs, "MANAGER")
      createAnnoucement("MANAGER", "Étudiants uniquement");
    });
})
