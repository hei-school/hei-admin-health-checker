export const credentialsMap = {
  STUDENT: {
    email: "test+student@mail.hei.school",
    password: Cypress.env("CYPRESS_STUDENT1_PASSWORD"),
  },
  TEACHER: {
    email: "test+teacher1@mail.hei.school",
    password: Cypress.env("CYPRESS_TEACHER1_PASSWORD"),
  },
  MANAGER: {
    email: "test+manager1@mail.hei.school",
    password: Cypress.env("CYPRESS_MANAGER1_PASSWORD"),
  },
  ADMIN: {
    email: "test+admin@mail.hei.school",
    password: Cypress.env("CYPRESS_ADMIN1_PASSWORD"),
  },
  MONITOR: {
    email: "test+monitor@mail.hei.school",
    password: Cypress.env("CYPRESS_MONITOR1_PASSWORD"),
  },
};

export const loopTab = (tabs) => {
  tabs.forEach((tab) => {
    cy.contains(tab).should("be.visible")
  })
}
