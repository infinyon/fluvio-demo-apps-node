describe("Test Fluvio Chat App", () => {
  it("Should create the first chat user", async () => {
    const faker = require("faker");
    const user = "user" + (Math.random() * 1e4).toFixed();
    const password = faker.internet.password().replace("_", "");
    const text = "TEST CHAT APP MESSAGE USER 1\n";

    cy.visit("/registerUser");
    cy.get("#name").type(user);
    cy.get("#password").type(password);
    cy.get(".MuiButtonBase-root").click().wait(6e9)
    cy.url().should('include', 'login');
    cy.get("#name").type(user);
    cy.get("#password").type(password);
    cy.get(".MuiButtonBase-root").click().wait(6e9)
    cy.get('.MuiToolbar-root').should('exist')
    cy.get("#text").type(text).wait(6e9)
    cy.get(
      ".MuiIconButton-edgeEnd > .MuiIconButton-label > .MuiSvgIcon-root"
    ).click();
    cy.get('.MuiList-root > [tabindex="0"]').click();
    cy.url().should('include', 'login');
  });
});
