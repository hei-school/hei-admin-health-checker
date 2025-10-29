const checkExam = (user) => {
  cy.loginAs(user);
  cy.contains("Examens").should("be.visible").click();
    cy.get('[data-testid="exam-card"]').first().click();
    cy.contains("Détails de l'examen").should("be.visible");
    cy.contains("Liste des participants").should("be.visible");
    cy.contains("ÉDITER").click()
    cy.contains("Modifier la note").should("be.visible")
    cy.get('[data-testid="CloseIcon"]').click()
    cy.get('.lucide-eye').first().click()
    cy.contains("Historique des modifications")
    cy.get('[data-testid=CloseIcon]').click()
    cy.contains("Historique des modifications").should("not.exist")
    cy.contains("ATTRIBUER").click()
    cy.contains("Attribuer une note").should("be.visible")
    cy.get('[data-testid=CloseIcon]').click()
    cy.contains("Attribuer une note").should("not.exist")
}

describe("exam test", () => {
  it("login as an admin", () => {
    checkExam("ADMIN")    
  });
  it("login as a manager", () => {
    checkExam("MANAGER")    
  });
  it("login as a teacher", () => {
    checkExam("TEACHER")    
  });
});
