'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    let ArrayCategory = ['Scholarship Test Category', 'Assignment Quiz', 'SEO Test Paper']
    let Category
    for (let index = 0; index < ArrayCategory.length; index++) {
      Category = await queryInterface.bulkInsert('categories', [{
        name: ArrayCategory[index],
        createdAt: new Date(),
        updatedAt: new Date(),
      }], { returning: true });

    }


  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
