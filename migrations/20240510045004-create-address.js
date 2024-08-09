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
      },
      PostalCode: {
        field: 'PostalCode',
        type: Sequelize.INTEGER,

      },
      Address: {
        field: 'Address',
        type: Sequelize.TEXT,

      },
      City: {
        field: 'City',
        type: Sequelize.STRING,

      },
      DistrictId: {
        field: 'DistrictId',
        type: Sequelize.INTEGER,

      },
      StateId: {
        field: 'StateId',
        type: Sequelize.INTEGER,
      },
      CountryId: {
        field: 'CountryId',
        type: Sequelize.INTEGER,
      },
      IsSame: {
        field: 'IsSame',
        type:Sequelize.BOOLEAN,

      },
      Area: {
        field: 'Area',
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
    await queryInterface.dropTable('addresses');
  }
};