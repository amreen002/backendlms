'use strict';

const { array } = require('../middlware/upload');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quizes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      QuizzName: {
        field: 'QuizzName',
        type: Sequelize.STRING
      },
      QuizzStartTime: {
        field: 'QuizzStartTime',
        type: Sequelize.DATE,
      },
      QuizzEndTime: {
        field: 'QuizzEndTime',
        type: Sequelize.DATE,
      },
      QuizzTestDuration: {
        field: 'QuizzTestDuration',
        type: Sequelize.INTEGER,
      },
      EasyQuestions: {
        field: 'EasyQuestions',
        type: Sequelize.INTEGER,
      },
      MediumQuestions: {
        field: 'MediumQuestions',
        type: Sequelize.INTEGER
      },
      HardQuestions: {
        field: 'HardQuestions',
        type: Sequelize.INTEGER
      },
      TotalQuestions:{
        field: 'TotalQuestions',
        type: Sequelize.INTEGER
      },
      TotalMarks:{
        field: 'TotalMarks',
        type: Sequelize.INTEGER
      },
      Instructions:{
        field: 'Instructions',
        type: Sequelize.TEXT('long')
      },
      QuizzCategoryId:{
        field: 'QuizzCategoryId',
        type: Sequelize.INTEGER
      },
      userId:{
        field: 'userId',
        type: Sequelize.INTEGER
      },
      BatchId:{
        field: 'BatchId',
        type: Sequelize.JSON, 
      },
      CourseId: {
        field: 'CourseId',
        type: Sequelize.INTEGER
      },
      createdAt: {
        field: 'createdAt',
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        field: 'updatedAt',
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('quizes');
  }
};