/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    addIngredient(name: string): Chainable<void>;
  }
}

Cypress.Commands.add('addIngredient', (name: string) => {
  cy.contains(name)

    .parents('li')
    .find('button')
    .contains('Добавить')
    .click();
});
