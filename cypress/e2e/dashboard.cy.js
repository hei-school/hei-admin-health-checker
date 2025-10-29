const greetings = [
  "Bonjour Admin",
  "Bon après-midi Admin",
  "Bonsoir Admin",
];

const sections = [
  "Lettres récemment envoyées",
  "Listes des frais en retard",
  "Listes de étudiants suspendus",
  "Les dernières annonces",
];

const buttons = [
  { label: "Tous les frais en retard", path: "/fees" },
  { label: "Tous les étudiants", path: "/students" },
  { label: "Tous les annonces", path: "/announcements" },
];

describe("AdminWelcome test", () => {
  it("test AdminWelcome as an admin", () => {
    cy.loginAs("ADMIN");
    cy.contains("Bienvenue").should("be.visible").click();

    greetings.forEach((text) => {
      cy.contains(text).should("be.visible");
    });

    sections.forEach((section) => {
      cy.contains(section).should("be.visible");
    });

    buttons.forEach(({ label, path }) => {
      cy.contains(label).should("be.visible").click();
      cy.url().should("include", path);
      cy.go("back");
    });

    cy.get('[data-testid="welcoming-manager-img"]').should("be.visible");

    cy.get('[data-testid="welcoming-radial-1"]').should("be.visible");
    cy.get('[data-testid="welcoming-radial-2"]').should("be.visible");

    cy.contains("Se déconnecter").should("be.visible").click();
  });

  it("test AdminWelcome as a teacher", () => {
    cy.loginAs("TEACHER");
    cy.contains("Bienvenue").should("be.visible").click();
    sections.forEach((section) => cy.contains(section).should("be.visible"));
    cy.contains("Se déconnecter").should("be.visible").click();
  });

  it("test AdminWelcome as a student", () => {
    cy.loginAs("STUDENT");
    cy.contains("Bienvenue").should("be.visible").click();
    sections.forEach((section) => cy.contains(section).should("be.visible"));
    cy.contains("Se déconnecter").should("be.visible").click();
  });

  it("test AdminWelcome as a manager", () => {
    cy.loginAs("MANAGER");
    cy.contains("Bienvenue").should("be.visible").click();
    sections.forEach((section) => cy.contains(section).should("be.visible"));
    cy.contains("Se déconnecter").should("be.visible").click();
  });
});
