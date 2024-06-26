'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      userId:{
        type: Sequelize.INTEGER,
      },
      CoursePrice:{
        field: 'CoursePrice',
        type: Sequelize.DOUBLE(25,2),
      },
      CourseCategoryId:{
        field: 'CourseCategoryId',
        type: Sequelize.INTEGER,
      },
      CourseDuration :{
        field: 'CourseDuration',
        type: Sequelize.STRING,    
      },
      CourseCode:{
        field: 'CourseCode',
        type: Sequelize.STRING,
      },
      CourseUplod:{
        field: 'CourseUplod',
        type: Sequelize.STRING,    
      },
      Status:{
        field: 'Status',
        type: Sequelize.BOOLEAN,   
        defaultValue:0
      },
      AboutCourse:{
        field: 'AboutCourse',
        type: Sequelize.TEXT('long'),   
      },
      Description:{
        field: 'Description',
        type: Sequelize.TEXT('long'),   
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
    await queryInterface.dropTable('courses');
  }
};