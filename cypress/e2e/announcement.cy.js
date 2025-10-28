import { loginAs } from "./utils";

const list = {
  admin_tab: [
    "Tous",
    "Managers uniquement",
    "Étudiants uniquement",
    "Enseignants uniquement",
  ],
  teacher_tab: ["Tous", "Tout le monde", "Enseignants uniquement"],
  student_tab: ["Tous", "Tout le monde", "Étudiants uniquement"],
};

const loopTab = (list) => {
  list.forEach((tab) => {
    cy.contains(tab).should("be.visible")
  })
  cy.get('[data-testid="letter-list-wrapper"]').should("be.visible");
}

const checkAnnouncement = (list, user) => {
    loginAs(user);
    cy.contains("Annonces").should("be.visible").click();
    loopTab(list);
    cy.contains(list[0]).click();
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
    checkAnnouncement(list.admin_tab, "ADMIN")
  });
  it("connect as a teacher", () => {
    checkAnnouncement(list.teacher_tab, "TEACHER")
  });
  it("connect as a student", () => {
    checkAnnouncement(list.student_tab, "STUDENT")
  }),
  it("connect as a manager", () => {
    checkAnnouncement(list.admin_tab, "MANAGER")
  });
})