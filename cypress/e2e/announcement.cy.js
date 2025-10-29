import {loopTab} from './utils.js' 
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
    cy.contains("Se déconnecter").should("be.visible").click()
}

describe("annoucement test", () => {
  it("test annoucement as an admin", () => {
    checkAnnouncement(user_tabs.admin_tabs, "ADMIN")
  });
  it("connect as a teacher", () => {
    checkAnnouncement(user_tabs.teacher_tabs, "TEACHER")
  });
  it("connect as a student", () => {
    checkAnnouncement(user_tabs.student_tabs, "STUDENT")
  }),
  it("connect as a manager", () => {
    checkAnnouncement(user_tabs.admin_tabs, "MANAGER")
  });
})
