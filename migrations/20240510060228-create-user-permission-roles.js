'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userpermissionroles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      modelName:{
        field: 'modelName',
        type: Sequelize.STRING,
        allowNull: true
      },
      RoleId: {
        field: 'RoleId',
        type: Sequelize.INTEGER,
        allowNull: true
      },
      UserId: {
        field: 'UserId',
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Create: {
        field: 'Create',
        type: Sequelize.BOOLEAN,
        defaultValue:0
      },
      Read: {
        field: 'Read',
        type: Sequelize.BOOLEAN,
        defaultValue:0
      },
      Update: {
        field: 'Update',
        type: Sequelize.BOOLEAN,
        defaultValue:0
      },
       Delete: {
        field: 'Delete',
        type: Sequelize.BOOLEAN,
        defaultValue:0
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
    await queryInterface.dropTable('userpermissionroles');
  }
};