import { getGreeting } from '../support/app.po';

describe('demo-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains(/Bitcoin Input Demo/);
  });
});
