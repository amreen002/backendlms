'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('batches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Title: {
        field: 'Title',
        type: Sequelize.STRING
      },
      userId:{
        field: 'userId',
        type: Sequelize.INTEGER,
      },
      BatchEniqueId: {
        field: 'BatchEniqueId',
        type: Sequelize.STRING
      },
      InstructorId: {
        field: 'InstructorId',
        type: Sequelize.INTEGER
      },
      CoursesId: {
        field: 'CoursesId',
        type: Sequelize.INTEGER
      },
      BatchDuration: {
        field: 'BatchDuration',
        type: Sequelize.STRING
      },
      BatchStartTime: {
        field: 'BatchStartTime',
        type: Sequelize.TIME
      },
      BatchEndTime: {
        field: 'BatchEndTime',
        type: Sequelize.TIME
      },
      BatchsInWeek: {
        field: 'BatchsInWeek',
        type: Sequelize.STRING
      },
      StartedAtWeek: {
        field: 'StartedAtWeek',
        type: Sequelize.DATEONLY
      },
      BatchStatus: {
        field: 'BatchStatus',
        type: Sequelize.ENUM('Open','Close')
      },
      BatchDatails: {
        field: 'BatchDatails',
        type: Sequelize.TEXT('long')
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
    await queryInterface.dropTable('batches');
  }
};