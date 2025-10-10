import { loginAs } from "./utils";

describe("exam test", () => {
  it("login as an admin", () => {
    loginAs("ADMIN");
    cy.contains("Examens").should("be.visible").click();

    cy.get('[data-testid="exam-card"]').first().click();

    cy.contains("Détails de l'examen").should("be.visible");
    cy.contains("Liste des participants").should("be.visible");
  });
});
