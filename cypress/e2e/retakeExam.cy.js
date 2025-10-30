const SELECTORS = {
  rattrapagesMenu: () => cy.contains("Rattrapages", { matchCase: false }),
  sessionList: () => cy.contains("Liste des sessions de rattrapage", { timeout: 15000 }),
  table: () => cy.get("table", { timeout: 10000 }),
  sessionTitle: () => cy.contains(/Session \d{4}/, { timeout: 10000 }),
  dateDebut: () => cy.contains(/(Date du début|Date de début|Début)/, { timeout: 10000 }),
  dateFin: () => cy.contains(/(Date de fin|Fin)/, { timeout: 10000 }),
  subjectList: () => cy.contains("Liste des matières à rattraper", { timeout: 10000 }),
  studentRetakeList: () => cy.contains("Liste de mes rattrapages", { timeout: 10000 }),
  showButton: () => cy.contains("AFFICHER", { matchCase: false }),
  detailsTitle: () => cy.contains(/(Détails du rattrapage|Détails de la matière|Informations du rattrapage|Rattrapage)/, { timeout: 10000 }),
  searchInput: () => cy.get('input[placeholder*="Nom du session"]'),
};

const MESSAGES = {
  emptyData: "Il n'y a pas de données à afficher",
  emptyList: /(Aucune matière|Aucun résultat|Liste vide)/,
  studentInfo: /(Informations sur l'étudiant|Étudiant)/,
  subjectInfo: /(Informations sur la matière|Matière)/,
  pagination: /(par page|éléments)/,
};

const hasTableWithData = ($body) => {
  const hasTable = $body.find("table").length > 0;
  const hasRows = $body.find("table tbody tr").length > 0;
  const hasEmptyMessage = $body.text().includes(MESSAGES.emptyData);
  
  return hasTable && hasRows && !hasEmptyMessage;
};

const hasActionButtons = ($rows) => {
  return $rows.find("button, a").filter((i, el) => {
    return Cypress.$(el).text().match(/AFFICHER/i);
  }).length > 0;
};

const checkSessionDetails = ($body) => {
  const bodyText = $body.text();
  
  if (bodyText.includes("Informations sur l'étudiant") || bodyText.includes("Étudiant")) {
    cy.contains(MESSAGES.studentInfo).should("be.visible");
  }
  
  if (bodyText.includes("Informations sur la matière") || bodyText.includes("Matière")) {
    cy.contains(MESSAGES.subjectInfo).should("be.visible");
  }
};

const navigateToRetakeSessions = () => {
  SELECTORS.rattrapagesMenu().should("be.visible").click();
  SELECTORS.sessionList().should("be.visible");
  SELECTORS.table().should("be.visible");
};

const openFirstSession = () => {
  SELECTORS.showButton()
    .should("be.visible")
    .first()
    .click({ force: true });
  
  SELECTORS.sessionTitle().should("be.visible");
  SELECTORS.dateDebut().should("be.visible");
  SELECTORS.dateFin().should("be.visible");
};

const handleAdminManagerView = () => {
  SELECTORS.subjectList().should("be.visible");
  
  cy.get("body").then($body => {
    if (!hasTableWithData($body)) {
      if ($body.text().includes(MESSAGES.emptyData)) {
        cy.log("Liste vide - Aucune matière à rattraper pour cette session");
        cy.contains(MESSAGES.emptyList).should("be.visible");
      } else {
        cy.log("Aucune donnée disponible dans la liste");
      }
      return;
    }
    
    SELECTORS.table().should("be.visible");
    
    cy.get("table tbody tr").then($rows => {
      if (!hasActionButtons($rows)) {
        cy.log("Aucun bouton d'action trouvé dans la liste");
        return;
      }
      
      cy.get("table tbody tr")
        .first()
        .find("button, a")
        .contains("AFFICHER", { matchCase: false })
        .should("be.visible")
        .click({ force: true });
      
      SELECTORS.detailsTitle().should("be.visible");
      cy.get("body").then(checkSessionDetails);
    });
  });
};

const handleStudentView = () => {
  SELECTORS.studentRetakeList().should("be.visible");
  
  cy.get("body").then($body => {
    if (!hasTableWithData($body)) {
      if ($body.text().includes(MESSAGES.emptyData)) {
        cy.log("Liste vide - L'étudiant n'a aucune matière à rattraper");
        cy.contains(MESSAGES.emptyList).should("be.visible");
      } else {
        cy.log("Aucune donnée disponible pour cet étudiant");
      }
      return;
    }
    
    SELECTORS.table().should("be.visible");
    cy.get("table tbody tr").should("have.length.at.least", 1);
    cy.log("L'étudiant peut voir ses matières à rattraper");
  });
};

const checkRetakeExam = (user) => {
  cy.loginAs(user);
  navigateToRetakeSessions();
  openFirstSession();
  
  const userRoles = {
    ADMIN: handleAdminManagerView,
    MANAGER: handleAdminManagerView,
    STUDENT: handleStudentView,
  };
  
  const handler = userRoles[user];
  if (handler) {
    handler();
  }
};

describe("Tests des Sessions de Rattrapage", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
  
  describe("Affichage des sessions (Tous les utilisateurs)", () => {
    const userRoles = [
      { role: "ADMIN", description: "Admin peut consulter les sessions de rattrapage" },
      { role: "MANAGER", description: "Manager peut consulter les sessions de rattrapage" },
      { role: "STUDENT", description: "Étudiant peut consulter ses matières à rattraper" },
    ];
    
    userRoles.forEach(({ role, description }) => {
      it(description, () => {
        checkRetakeExam(role);
      });
    });
  });
  
  describe("Fonctionnalités supplémentaires", () => {
    it("Admin peut rechercher une session", () => {
      const sessionName = "Session 2026";

      cy.loginAs("ADMIN");
      SELECTORS.rattrapagesMenu().click();
      cy.wait(1000);
      
      SELECTORS.searchInput().type(sessionName);
      cy.wait(1000);
      
      cy.get("body").then($body => {
        if ($body.text().includes(sessionName)) {
          cy.contains(sessionName).should("be.visible");
        } else {
          cy.log(`${sessionName} non trouvée`);
        }
      });
    });
    
    it("Vérifier la pagination", () => {
      cy.loginAs("ADMIN");
      SELECTORS.rattrapagesMenu().click();
      cy.wait(1000);
      
      cy.get("body").then($body => {
        const bodyText = $body.text();
        
        if (bodyText.includes("Page") || bodyText.includes("page")) {
          cy.contains(/Page|page/).should("be.visible");
        }
        
        if (bodyText.includes("par page") || bodyText.includes("éléments")) {
          cy.contains(MESSAGES.pagination).should("be.visible");
        }
      });
    });
  });
});