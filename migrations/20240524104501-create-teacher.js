'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('teachers', {
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
      DOB: {
        field: 'DOB',
        type: Sequelize.DATEONLY
      },
      TeacherType: {
        field: 'TeacherType',
        type: Sequelize.ENUM("Online","Offline")
      },
      Username: {
        field: 'Username',
        type: Sequelize.STRING
      },
      PhoneNumber: {
        field: 'PhoneNumber',
        type: Sequelize.BIGINT
      },
      YourIntroducationAndSkills: {
        field: 'YourIntroducationAndSkills',
        type: Sequelize.TEXT('long')
      },
      roleId: {
        field: 'roleId',
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
    await queryInterface.dropTable('teachers');
  }
};