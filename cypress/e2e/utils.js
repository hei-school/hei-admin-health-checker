export const loginAs = (role) => {
  const credentialsMap = {
    STUDENT: {
      email: "test+ryan@hei.school",
      password: Cypress.env("CYPRESS_STUDENT1_PASSWORD"),
    },
    TEACHER: {
      email: "test+teacher1@hei.school",
      password: Cypress.env("CYPRESS_TEACHER1_PASSWORD"),
    },
    MANAGER: {
      email: "test+manager1@hei.school",
      password: Cypress.env("CYPRESS_MANAGER1_PASSWORD"),
    },
    ADMIN: {
      email: "test+admin@hei.school",
      password: Cypress.env("CYPRESS_ADMIN1_PASSWORD"),
    },
  };

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
        .type(password+ "{enter}");
    }
  );

  cy.contains("Dahboard").should("be.visible");
};

