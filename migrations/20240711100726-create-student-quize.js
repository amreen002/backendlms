'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('studentquizes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      QuizeId: {
        field: 'QuizeId',
        type: Sequelize.INTEGER,
      },
      QuestionId: {
        field: 'QuestionId',
        type: Sequelize.INTEGER,
      },
      StudentId: {
        field: 'StudentId',
        type: Sequelize.INTEGER,
      },
      AnswersStudent: {
        field: 'AnswersStudent',
        type:  Sequelize.STRING,
      },
      Incorrect: {
        field: 'Incorrect',
        type: Sequelize.BOOLEAN,
        defaultValue:0
      },
      Correct: {
        field: 'Correct',
        type: Sequelize.BOOLEAN,
        defaultValue:0
      },
      TimeTaken: {
        field: 'TimeTaken',
        type: Sequelize.TIME,
      },

      AnswersStudent: {
        field: 'AnswersStudent',
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('studentquizes');
  }
};