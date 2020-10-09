describe('Test Fluvio Chat App', () => {
    it('Should create a new user', async () => {
        const faker = require('faker')
        const name = faker.name.firstName().toLowerCase().replace(" ", "_");
        const password = faker.internet.password().replace("_", "");
        const text = faker.lorem.paragraphs() + '\n';

        cy.visit('/')

        cy.get('.jss286 > .jss10').click().then(() => {
            cy.get('#name').type(name)
            cy.get('#password').type(password)

            cy.get('.MuiButtonBase-root').click().then(() => {
                cy.get('#name').type(name)
                cy.get('#password').type(password)

                cy.get('.MuiButtonBase-root').click().then(async () => {
                    cy.get('#text').type(text)
                })
            })
        })
    })
})