'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('Lession', ['coursesId'], {
      name: 'lession_ibfk_1'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('frontdesks', 'frontdesks_ibfk_1');
  }
};
