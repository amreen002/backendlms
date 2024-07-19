'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'teachers', // table name
        'CousesId', // new field name
        {
          field: 'CousesId',
          type: Sequelize.INTEGER
        },
      ),
      queryInterface.addColumn(
        'teachers',
        'image',
        {
          field: 'image',
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'students',
        'image',
        {
          field: 'image',
          type: Sequelize.STRING,
        },
      ),
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('teachers', 'CousesId'),
      queryInterface.removeColumn('teachers', 'image'),
      queryInterface.removeColumn('students', 'image'),
    ]);
  },
};

