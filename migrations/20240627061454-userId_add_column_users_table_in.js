'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
 /*  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'Questions',
        'userId',
        Sequelize.INTEGER
      );
      await queryInterface.addColumn(
        'Topic',
        'userId',
         Sequelize.INTEGER
      );
      await queryInterface.addColumn(
        'Video',
        'userId',
         Sequelize.INTEGER
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }, */

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.removeColumn(
        'Questions',
        'userId',
        { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

}