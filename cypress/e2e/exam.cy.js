import { loginAs } from "./utils";

describe("exam test", () => {
  it("login as an admin", () => {
    loginAs("ADMIN");
    cy.contains("Examens").should("be.visible").click();

    cy.get('[data-testid="exam-card"]').first().click();

    cy.contains("Détails de l'examen").should("be.visible");
    cy.contains("Liste des participants").should("be.visible");

    cy.get('tr.MuiTableRow-root', { timeout: 10000 })
      .should("exist")
      .and("have.length.greaterThan", 0);

    cy.get('tr.MuiTableRow-root').first().within(() => {
      cy.get('svg.lucide-eye').parent('button').click({ force: true });
    });

    cy.contains('h2', 'Historique des modifications', { timeout: 5000 }).should('be.visible');
    cy.get('button[aria-label="Close"]').click({ force: true });
    cy.contains('h2', 'Historique des modifications').should('not.exist');

    cy.get('tr.MuiTableRow-root').first().within(() => {
      cy.contains('button', 'ÉDITER').click({ force: true });
    });

    cy.contains('h2', 'Modifier la note', { timeout: 5000 }).should('be.visible');
    cy.get('button[aria-label="Close"]').click({ force: true });
    cy.contains('h2', 'Modifier la note').should('not.exist');
  });
});
