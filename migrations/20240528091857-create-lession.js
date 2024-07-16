'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      LessionTitle: {
        field: 'LessionTitle', 
        type: Sequelize.STRING
      },
      CoursesId: {
        field: 'CoursesId', 
        type: Sequelize.INTEGER
      },
      TopicId: {
        field: 'TopicId', 
        type: Sequelize.INTEGER
      },
      LessionUpload: {
        field: 'LessionUpload', 
        type: Sequelize.JSON,
      },
      userId:{
        field: 'userId',
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('lessions');
  }
};