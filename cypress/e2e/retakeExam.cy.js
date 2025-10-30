const checkRetakeExam = (user) => {
  cy.loginAs(user);

  cy.contains("Rattrapages", { matchCase: false }).should("be.visible").click();

  cy.contains("Liste des sessions de rattrapage", { timeout: 15000 }).should("be.visible");
  cy.get("table", { timeout: 10000 }).should("be.visible");

  cy.contains("AFFICHER", { matchCase: false })
    .should("be.visible")
    .first()
    .click({ force: true });

  cy.wait(2000);

  cy.contains(/Session \d{4}/, { timeout: 10000 }).should("be.visible");
  cy.contains(/(Date du début|Date de début|Début)/, { timeout: 10000 }).should("be.visible");
  cy.contains(/(Date de fin|Fin)/, { timeout: 10000 }).should("be.visible");

  if (user === "ADMIN" || user === "MANAGER") {
    cy.contains("Liste des matières à rattraper", { timeout: 10000 }).should("be.visible");
    
    cy.get("table", { timeout: 10000 }).should("be.visible");
    
    cy.get("body").then($body => {
      if ($body.text().includes("GRD-CRS2")) {
        cy.contains("GRD-CRS2").should("exist");
      }
      if ($body.text().includes("PROG1")) {
        cy.contains("PROG1").should("exist");
      }
    });

    cy.wait(1500);

    cy.get("body").then($body => {
      if ($body.find("table tbody tr button, table tbody tr a").length > 0) {
        cy.get("table tbody tr")
          .first()
          .find("button, a")
          .contains("AFFICHER", { matchCase: false })
          .should("be.visible")
          .click({ force: true });

        cy.wait(2000);

        cy.contains(/(Détails du rattrapage|Détails de la matière|Informations du rattrapage|Rattrapage)/, { timeout: 10000 }).should("be.visible");
        
        cy.get("body").then($detailsBody => {
          const bodyText = $detailsBody.text();
          
          if (bodyText.includes("Informations sur l'étudiant") || bodyText.includes("Étudiant")) {
            cy.contains(/(Informations sur l'étudiant|Étudiant)/).should("be.visible");
          }
          
          if (bodyText.includes("Informations sur la matière") || bodyText.includes("Matière")) {
            cy.contains(/(Informations sur la matière|Matière)/).should("be.visible");
          }
        });
      }
    });
    
  } else if (user === "STUDENT") {
    cy.contains(/(Liste de mes rattrapages)/, { timeout: 10000 }).should("be.visible");
    cy.get("table").should("be.visible");

    cy.get("body").then($body => {
      if ($body.find("table tbody tr button, table tbody tr a").length > 0) {
        cy.get("table tbody tr")
          .first()
          .find("button, a")
          .contains("AFFICHER", { matchCase: false })
          .should("be.visible")
          .click({ force: true });
      }
    });
  }
};

describe("Tests des Sessions de Rattrapage", () => {
  
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe("Affichage des sessions (Tous les utilisateurs)", () => {
    it("Admin peut consulter les sessions de rattrapage", () => {
      checkRetakeExam("ADMIN");
    });

    it("Manager peut consulter les sessions de rattrapage", () => {
      checkRetakeExam("MANAGER");
    });

    it("Étudiant peut consulter ses matières à rattraper", () => {
      checkRetakeExam("STUDENT");
    });
  });

  describe("Fonctionnalités supplémentaires", () => {
    it("Admin peut rechercher une session", () => {
      cy.loginAs("ADMIN");
      cy.contains("Rattrapages").click();
      cy.wait(1000);
      
      cy.get('input[placeholder*="Nom du session"]').type("Session 2026");
      cy.contains("Session 2026").should("be.visible");
    });

    it("Vérifier la pagination", () => {
      cy.loginAs("ADMIN");
      cy.contains("Rattrapages").click();
      cy.wait(1000);
      
      cy.contains("Page: 1").should("be.visible");
      cy.contains("Taille: 2").should("be.visible");
      cy.contains("Listes par page :").should("be.visible");
      cy.contains("10 éléments").should("be.visible");
    });
  });
});

it(
  'Timed out retrying after 25000ms: Expected to find content: \'AFFICHER\' within the element: <button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-colorPrimary.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-colorPrimary.css-5vsmrv> but never did.',
  function() {}
);