'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    let ArrayCategory = ['CBSE','ICSE']
    let ArrayCategoryQuestions = ['Scholarship Test Category',' Assignments','Quizzes And Assessments','SEO Test Paper']
  
    for (let index = 0; index < ArrayCategory.length; index++) {
      await queryInterface.bulkInsert('categories', [{
        name: ArrayCategory[index],
        createdAt: new Date(),
        updatedAt: new Date(),
      }], { returning: true });

    }
    for (let i = 0; i < ArrayCategoryQuestions.length; i++) {
      await queryInterface.bulkInsert('categoriesquestions', [{
        name: ArrayCategoryQuestions[i],
        createdAt: new Date(),
        updatedAt: new Date(),
      }], { returning: true });

    }

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
    await queryInterface.bulkDelete('categoriesquestions', null, {});
  }
};
