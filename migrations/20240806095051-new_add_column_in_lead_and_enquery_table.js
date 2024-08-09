'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
    queryInterface.addColumn(
        'saleteams', // table name
        'lastname', // new field name
        {
          field: 'lastname',
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'saleteams', // table name
        'username', // new field name
        {
          field: 'username',
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'saleteams', // table name
        'status', // new field name
        {
          field: 'status',
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'saleteams', // table name
        'lead_status', // new field name
        {
          field: 'lead_status',
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'saleteams', // table name
        'courseId', // new field name
        {
          field: 'courseId',
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
      ),
      queryInterface.addColumn(
        'saleteams',
        'batchId',
        {
          field: 'batchId',
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        }
      ),
      queryInterface.addColumn(
        'saleteams',
        'AddressableId',
        {
          field: 'AddressableId',
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
      ),
      // frontdesks
      queryInterface.addColumn(
        'frontdesks', // table name
        'lastname', // new field name
        {
          field: 'lastname',
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'frontdesks', // table name
        'username', // new field name
        {
          field: 'username',
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'frontdesks', // table name
        'lead_status', // new field name
        {
          field: 'lead_status',
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'frontdesks',
        'batchId',
        {
          field: 'batchId',
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        }
      ),
      queryInterface.addColumn(
        'frontdesks',
        'status',
        {
          field: 'status',
          type: Sequelize.ENUM('1st Call', '2nd Call', '3rd Call', '4rd Call', 'Not Responding (N/R)', 'Other'),
        }
      ),
      
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('saleteams', 'lastname'),
      queryInterface.removeColumn('saleteams', 'username'),
      queryInterface.removeColumn('saleteams', 'status'),
      queryInterface.removeColumn('saleteams', 'courseId'),
      queryInterface.removeColumn('saleteams', 'batchId'),
      queryInterface.removeColumn('saleteams', 'AddressableId'),
      queryInterface.removeColumn('frontdesks', 'lastname'),
      queryInterface.removeColumn('frontdesks', 'username'),
      queryInterface.removeColumn('frontdesks', 'courseId'),
      queryInterface.removeColumn('frontdesks', 'batchId'),
    ]);
  },
};

