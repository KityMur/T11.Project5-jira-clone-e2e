describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const getConfirmModal = () => cy.get('[data-testid="modal:confirm"]');
  const comment = "This is a new comment";
  const editedCommentText = "comment";
  const issueComment = '[data-testid="issue-comment"]';
  const commentInput = 'textarea[placeholder="Add a comment..."]';

  function editComment() {
    cy.get(commentInput)
      .should("contain", comment)
      .clear()
      .type(editedCommentText);
  }
  function deleteComment() {
    cy.find(issueComment).contains("Delete").click();
  }

  it("should create, edit and delete comment", () => {
    getIssueDetailsModal().within(() => {
      cy.contains("Add a comment...").click();
      cy.get(commentInput).type(comment);
      cy.contains("button", "Save").click();
      cy.contains(comment).should("exist");

      cy.get(issueComment).first().contains("Edit").click().should("not.exist");
      editComment();
      cy.contains("button", "Save").click().should("not.exist");
      cy.get(issueComment)
        .first()
        .should("contain", "Edit")
        .and("contain", editedCommentText);
      deleteComment();
      getConfirmModal().within(() => {
        cy.contains("button", "Delete comment").click();
      });
      cy.contains(editedCommentText).should("not.exist");
    });
  });
});
