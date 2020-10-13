describe("Test Fluvio Chat App", () => {
  it("Should create a new user", async () => {
    const faker = require("faker");
    const user1 = "user" + (Math.random() * 1e4).toFixed();
    const user2 = "user" + (Math.random() * 1e4).toFixed();
    const password = faker.internet.password().replace("_", "");
    const text1 = "TEST CHAT APP MESSAGE USER 1\n";
    const text2 = "TEST CHAT APP MESSAGE USER 2\n";

    cy.visit("/registerUser").then(() => {
      cy.get("#name").type(user1);
      cy.get("#password").type(password);

      cy.get(".MuiButtonBase-root")
        .click()
        .then(() => {
          cy.get("#name").type(user1);
          cy.get("#password").type(password);

          cy.get(".MuiButtonBase-root")
            .click()
            .then(async () => {
              cy.get("#text").type(text1);

              cy.get(
                ".MuiIconButton-edgeEnd > .MuiIconButton-label > .MuiSvgIcon-root"
              ).click();

              cy.get('.MuiList-root > [tabindex="0"]')
                .click()
                .then(async () => {
                  cy.visit("/registerUser").then(() => {
                    cy.get("#name").type(user2);
                    cy.get("#password").type(password);

                    cy.get(".MuiButtonBase-root")
                      .click()
                      .then(() => {
                        cy.get("#name").type(user2);
                        cy.get("#password").type(password);

                        cy.get(".MuiButtonBase-root")
                          .click()
                          .then(async () => {
                            cy.get("#text").type(text2);

                            cy.get(
                              ".MuiIconButton-edgeEnd > .MuiIconButton-label > .MuiSvgIcon-root"
                            ).click();

                            cy.get('.MuiList-root > [tabindex="0"]').click();
                          });
                      });
                  });
                });
            });
        });
    });
  });
});
