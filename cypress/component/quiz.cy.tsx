import React from 'react';
import Quiz from '../../client/src/components/Quiz';
//import questions from '../fixtures/questions.json';
//import type { Question } from '../../client/src/models/Question';

const typedQuestions = [
    {
      question: "Which CSS property is used to change the text color of an element?",
      answers: [
        { text: "color", isCorrect: true },
        { text: "font-color", isCorrect: false },
        { text: "text-color", isCorrect: false },
        { text: "background-color", isCorrect: false }
      ]
    },
    {
      question: "Which JavaScript method converts a JSON string into an object?",
      answers: [
        { text: "JSON.parse()", isCorrect: true },
        { text: "JSON.stringify()", isCorrect: false },
        { text: "JSON.toObject()", isCorrect: false },
        { text: "JSON.convert()", isCorrect: false }
      ]
    }
  ];
  
  describe('<Quiz />', () => {
    // Before each test, intercept the API call to return our mock questions and mount the Quiz component.
    beforeEach(() => {
      cy.intercept('GET', '/api/questions/random', { body: typedQuestions }).as('getQuestions');
      cy.mount(<Quiz />);
    });
  
    it('renders the Start Quiz button initially', () => {
      cy.contains('Start Quiz').should('be.visible');
    });
  
    it('starts the quiz and displays the first question', () => {
      cy.contains('Start Quiz').click();
      cy.contains(typedQuestions[0].question).should('be.visible');
    });
  
    it('updates score and moves to the next question on a correct answer click', () => {
      cy.contains('Start Quiz').click();
  
      // Get the correct answer text for the first question.
      const correctAnswer = typedQuestions[0].answers.find((a) => a.isCorrect)?.text;
      if (!correctAnswer) {
        throw new Error('No correct answer found for the first question');
      }
      
      // Find the element containing the correct answer text, then its adjacent button, and click it.
      cy.contains(correctAnswer)
        .parent()
        .find('button')
        .click();
      
      // Ensure the second question is now visible.
      cy.contains(typedQuestions[1].question).should('be.visible');
    });
  
    it('completes the quiz and shows the final score', () => {
      cy.contains('Start Quiz').click();
  
      // Answer the first question correctly.
      const correctAnswer1 = typedQuestions[0].answers.find((a) => a.isCorrect)?.text;
      if (!correctAnswer1) {
        throw new Error('No correct answer found for the first question');
      }
      cy.contains(correctAnswer1)
        .parent()
        .find('button')
        .click();
  
      // Answer the second question correctly.
      const correctAnswer2 = typedQuestions[1].answers.find((a) => a.isCorrect)?.text;
      if (!correctAnswer2) {
        throw new Error('No correct answer found for the second question');
      }
      cy.contains(correctAnswer2)
        .parent()
        .find('button')
        .click();
  
      // Verify that the quiz completion screen shows the correct score.
      cy.contains('Quiz Completed').should('be.visible');
      cy.contains(`Your score: ${typedQuestions.length}/${typedQuestions.length}`).should('be.visible');
    });
  });