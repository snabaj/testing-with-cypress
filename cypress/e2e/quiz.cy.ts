describe('Quiz E2E Test', () => {
    beforeEach(() => {
      // Intercept the network call for questions and serve our questions.json fixture.
      cy.intercept('GET', '/api/questions/random', { fixture: 'questions.json' }).as('getQuestions');
      // Visit the quiz page 
      cy.visit('/quiz');
    });
  
    it('completes the quiz and displays the final score correctly', () => {
      // Start the quiz
      cy.contains('Start Quiz').click();
      cy.wait('@getQuestions');
  
      // Load the questions fixture to simulate answering each question correctly.
      cy.fixture('questions.json').then((questions) => {
        questions.forEach((question: any) => {
          // Ensure the question text is visible
          cy.contains(question.question).should('be.visible');
          // Find the correct answer's text and click its corresponding button
          const correctAnswer = question.answers.find((a: any) => a.isCorrect)?.text;
          cy.contains(correctAnswer)
            .parent()
            .find('button')
            .click();
        });
        // After answering all questions, check the quiz completed screen and score
        cy.contains('Quiz Completed').should('be.visible');
        cy.contains(`Your score: ${questions.length}/${questions.length}`).should('be.visible');
      });
    });
  });