'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Questions: {
        field: 'Questions',
        type: Sequelize.TEXT('long')
      },
      Type: {
        field: 'Type',
        type: Sequelize.ENUM('Number of Easy Questions (1 Mark)','Number of Medium Questions (2 Mark)','Number of Hard Questions (4 Mark)')
      },
      QuizzeId:{
        field: 'QuizzeId',
        type: Sequelize.INTEGER
      },
      CategoryId:{
        field: 'CategoryId',
        type: Sequelize.INTEGER
      },
      Options1: {
        field: 'Options1',
        type: Sequelize.STRING
      },
      Options2:{
        field: 'Options2',
        type: Sequelize.STRING
      },
      Options3:{
        field: 'Options3',
        type: Sequelize.STRING
      },
      Options4:{
        field: 'Options4',
        type: Sequelize.STRING
      },
      Answer:{
        field: 'Answer',
        type: Sequelize.JSON
      },
      userId:{
        field: 'userId',
        type: Sequelize.INTEGER
      },
      studentId:{
        field: 'studentId',
        type: Sequelize.JSON
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
    await queryInterface.dropTable('questions');
  }
};