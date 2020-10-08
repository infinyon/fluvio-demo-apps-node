describe('Test Fluvio Chat App', () => {
    it('Should create a new user', async () => {
        const faker = require('faker')
        const name = faker.name.firstName().toLowerCase().replace(" ", "_");
        const password = faker.internet.password();
        const text = faker.lorem.paragraphs() + '\n';

        cy.visit('/')

        cy.get('.MuiBox-root-286 > .makeStyles-links-10').click();

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