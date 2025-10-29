import { loopTab } from "./utils.js";

const user_tabs = {
  student_tabs: ["Détails du Profil", "Commentaires", "Boîte aux lettres"],
  admin_tabs: ["Détails du Profil", "Boîte aux lettres"],
  monitor_tabs: ["Détails du Profil"],
  teacher_tabs: ["Détails du Profil", "Boîte aux lettres"],
  manager_tabs: ["Détails du Profil", "Boîte aux lettres"]
};

const filter_menu = ["Tous", "En cours", "Accepté", "Invalide"];


const checkProfil = (tabs, user) => {
  cy.loginAs(user);
  cy.contains("Profil").should("be.visible").click();
  loopTab(tabs);
  cy.contains(tabs[0]).click();
  cy.contains("Coordonnées");
};

const filterConsistency = () => {
      cy.contains("Boîte aux lettres").click();
  filter_menu.forEach((filter, index) => {
      cy.contains("Filtre").should("be.visible").click();
    cy.contains(filter).click();
    cy.wait(1000);
    
    cy.get('[data-testid="letter-list-wrapper"]')
      .then(($wrapper) => {
        const elements = $wrapper.find('.MuiBox-root.css-1910b4i');
        const hasElements = elements.length > 0;
        if (hasElements && filter !== 'Tous') {
          cy.wrap($wrapper)
            .find('.MuiBox-root.css-1910b4i')
            .each(($card, cardIndex) => {
              cy.wrap($card)
                .find('.MuiTypography-body1.css-4oqbdo')
                .should('contain', filter);
            });
        }
      });
  });
};

const createLetter = () => {
  cy.get('[data-testid="letter-create-button"]').click();
  cy.get('#description').click();
  cy.get('#description').type(`test${Date.now()}`);
  cy.get('[data-testid="dropzone"]').selectFile('cypress/fixtures/convention.pdf', {
      action: 'drag-drop'
    });
  cy.get('[data-testid="add-letter"] button.css-15n29yk').click();
  cy.get('button.ra-confirm').click();
  cy.get('[data-testid="letter-create-button"]').click();
  cy.get('#description').click();
  cy.get('[data-testid="CloseIcon"]').click();
  cy.wait(3000);
  cy.get('[data-testid="TuneIcon"]').click();
  cy.get('li.css-6gazsy').click();
  cy.contains("En attente").should("be.visible")
  cy.contains("Se déconnecter").should("be.visible").click();
}

const acceptMostRecentLetter = () => {
  cy.get('#letter-option')
    .first()
    .click();
  cy.contains('Accepter', { timeout: 5000 })
    .should('be.visible')
    .click()
    .then(() => {
      cy.get('button.ra-confirm').click();
    })
};

const refuseMostRecentLetter = () => {
  cy.get('#letter-option')
    .first()
    .click();
  cy.contains('Refuser', { timeout: 5000 })
    .should('be.visible')
    .click()
    .then(() => {
      cy.get('button.ra-confirm').click();
    })
};

describe('Tests user profil', () => {
  it('should check profil as a student and should create letter', () => {
    checkProfil(user_tabs.student_tabs, "STUDENT");
      filterConsistency();
      createLetter();
    cy.get('[data-testid="casdoor-login-btn"]').click();
  });

  it(`admin should accept student's letter`, () => {
    cy.loginAs("ADMIN");
    acceptMostRecentLetter();
  });

  it('should check profil as monitor', () => {
    checkProfil(user_tabs.monitor_tabs, "MONITOR");
  });

  it('should check profil as a teacher', () => {
    checkProfil(user_tabs.teacher_tabs, "TEACHER");
      filterConsistency();
      createLetter();
  });

  it(`should refuse teacher's letter`, () => {
    cy.loginAs("ADMIN");
    refuseMostRecentLetter();
  });

  it('should check profil as a manager', () => {
    checkProfil(user_tabs.manager_tabs, "MANAGER");
  });
});


