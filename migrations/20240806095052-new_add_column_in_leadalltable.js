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
      queryInterface.addColumn(
        'telecallerdepartments', // table name
        'lastname', // new field name
        {
          field: 'lastname',
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'telecallerdepartments', // table name
        'username', // new field name
        {
          field: 'username',
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'telecallerdepartments', // table name
        'lead_status', // new field name
        {
          field: 'lead_status',
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'telecallerdepartments', // table name
        'courseId', // new field name
        {
          field: 'courseId',
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
      ),
      queryInterface.addColumn(
        'telecallerdepartments',
        'batchId',
        {
          field: 'batchId',
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        }
      ),
      queryInterface.addColumn(
        'telecallerdepartments',
        'AddressableId',
        {
          field: 'AddressableId',
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
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
      queryInterface.removeColumn('telecallerdepartments', 'lastname'),
      queryInterface.removeColumn('telecallerdepartments', 'username'),
      queryInterface.removeColumn('telecallerdepartments', 'courseId'),
      queryInterface.removeColumn('telecallerdepartments', 'batchId'),
      queryInterface.removeColumn('telecallerdepartments', 'AddressableId'),
    ]);
  },
};

