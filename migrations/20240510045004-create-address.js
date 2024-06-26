'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      AddressableType: {
        field: 'AddressableType',
        type: Sequelize.STRING,
      },
      AddressableId: {
        field: 'AddressableId',
        type: Sequelize.INTEGER,
        allowNull: false
      },
      AddressType: {
        field: 'AddressType',
        type: Sequelize.STRING,
        allowNull: false
      },
      PostalCode: {
        field: 'PostalCode',
        type: Sequelize.INTEGER,
        allowNull: true
      },
      Address: {
        field: 'Address',
        type: Sequelize.TEXT,
        allowNull: false
      },
      City: {
        field: 'City',
        type: Sequelize.STRING,
        allowNull: false
      },
      DistrictId: {
        field: 'DistrictId',
        type: Sequelize.INTEGER,
        allowNull: true
      },
      StateId: {
        field: 'StateId',
        type: Sequelize.INTEGER,
        allowNull: false
      },
      CountryId: {
        field: 'CountryId',
        type: Sequelize.INTEGER,
        allowNull: false
      },
      IsSame: {
        field: 'IsSame',
        type:Sequelize.BOOLEAN,
         allowNull:true
      },
      Area: {
        field: 'Area',
        type: Sequelize.STRING,
        allowNull: true
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
    await queryInterface.dropTable('addresses');
  }
};