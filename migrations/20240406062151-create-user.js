'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      userName: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.BIGINT,
        defaultValue:0
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      resentPassword: {
        type: Sequelize.STRING
      },
      passwordResetOtp: {
        type: Sequelize.STRING
      },
      expireToken: {
        type: Sequelize.STRING
      },
      assignToUsers: {
        type: Sequelize.INTEGER
      },
      departmentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      teacherId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      AddressableId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      roleName: {
        type: Sequelize.ENUM('Super Admin', 'Admin', 'Sub Admin')
      },
      image: {
        type: Sequelize.STRING
      },
      src: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      message: {
        type: Sequelize.TEXT('long')
      },
      active: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('users');
  }
};