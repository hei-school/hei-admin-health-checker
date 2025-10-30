// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

import { credentialsMap } from "../e2e/utils.js"

Cypress.Commands.add('loginAs', (role) => {
  const credentials = credentialsMap[role];

  cy.visit("https://preprod.admin.hei.school/login");

  cy.get('[data-testid="casdoor-login-btn"]').click();

  cy.origin(
    "https://numer.casdoor.com",
    { args: credentials },
    ({ email, password }) => {
      cy.get('input[placeholder*="identifiant"]')
        .first()
        .should("be.visible")
        .type(email);

      cy.get('input[type="password"]')
        .first()
        .type(password + "{enter}");
    }
  );

  cy.contains("Dashboard").should("be.visible");
})
