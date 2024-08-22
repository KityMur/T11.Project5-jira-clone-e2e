const estimatedTime = "10";
const estimatedTimeUpdated = "20";
const defaultTimeSpent = 3;
const defaultTimeRemaining = 4;
const timeEstimateInput = () => cy.get('input[placeholder="Number"]');

describe("Time Tracking", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.", { timeout: 60000 })
          .should("be.visible")
          .click();
      });
  });

  it("should add, edit, and remove an estimation", () => {
    // Add an estimation
    cy.wait(1000);
    cy.get(timeEstimateInput).should("be.empty").click().type(estimatedTime);
    cy.wait(1000);
    cy.get('[data-testid="icon:close"]').click();
    cy.wait(1000);
    cy.get('[data-testid="modal:issue-details"]').should("not.exist");

    //open issue to check added estimation
    cy.get('[data-testid="board-list:backlog"]').should("be.visible");
    cy.get(timeEstimateInput).should("have.value", estimatedTime);

    //update
    cy.get(timeEstimateInput).clear().type(estimatedTimeUpdated);
    cy.wait(1000);
    cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.get('[data-testid="icon:close"]').click();
    });
    cy.get('[data-testid="modal:issue-details"]').should("not.exist");
    //Open the issue to check the updated estimation
    cy.get('[data-testid="board-list:backlog"]').should("be.visible");
    cy.get('input[placeholder="Number"]').should(
      "have.value",
      estimatedTimeUpdated,
    );
    //remove
    cy.get('input[placeholder="Number"]').clear();
    cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.get('[data-testid="icon:close"]').click();
    });
    cy.get('[data-testid="modal:issue-details"]').should("not.exist");
    // Open the issue to check the removed estimation
    cy.get('[data-testid="board-list:backlog"]').should("be.visible");
    cy.get(timeEstimateInput).should("be.empty");
  });
  //time logging
  it("should add default time to time tracking", () => {
    cy.get('[data-testid="icon:stopwatch"]').click();
    cy.get('[data-testid="modal:tracking"]').should("be.visible");
    cy.get('[data-testid="modal:tracking"]').within(() => {
      cy.get('[placeholder="Number"]').first().clear();
      cy.get('[placeholder="Number"]').last().clear();
    });
    cy.get('[data-testid="modal:tracking"]').contains("button", "Done").click();
  });
});
