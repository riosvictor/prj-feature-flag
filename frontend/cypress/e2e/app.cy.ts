describe('Navigation', () => {
  it('should navigate to the new page', () => {
    cy.intercept('GET', '/feature_flags?skip=*&take=*', { fixture: 'flags.json' })

    // Start from the index page
    cy.visit('http://localhost:3000/')
 
    // Find a link with an href attribute containing "about" and click it
    cy.get('main div:first button').click()
 
    // The new url should include "/about"
    cy.url().should('include', '/new')
 
    // The new page should contain an h1 with "About"
    cy.get('h2').contains('Nova')
  })
})

export {}