'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Students', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Name: {
        field: 'Name',
        type: Sequelize.STRING
      },
      LastName: {
        field: 'LastName',
        type: Sequelize.STRING
      },
      AddressableId: {
        field: 'AddressableId',
        type: Sequelize.INTEGER,
      },
      Email: {
        field: 'Email',
        type: Sequelize.STRING
      },
      Password: {
        field: 'Password',
        type: Sequelize.STRING
      },
      Username: {
        field: 'Username',
        type: Sequelize.STRING
      },
      PhoneNumber: {
        field: 'PhoneNumber',
        type: Sequelize.BIGINT
      },
      roleId: {
        field: 'roleId',
        type: Sequelize.INTEGER
      },
      Date: {
        field: 'Date',
        type: Sequelize.DATEONLY
      },
      CoursesId:{
        field: 'CoursesId',
        type: Sequelize.INTEGER,
      },
      BatchId:{
        field: 'BatchId',
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Students');
  }
};