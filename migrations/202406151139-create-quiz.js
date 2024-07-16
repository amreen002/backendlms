'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Quizes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      QuizzName: {
        type: Sequelize.STRING
      },
      QuizzStartTime: {
        type: Sequelize.DATE
      },
      QuizzEndTime: {
        type: Sequelize.DATE
      },
      QuizzTestDuration: {
        type: Sequelize.INTEGER
      },
      EasyQuestions: {
        type: Sequelize.INTEGER
      },
      MediumQuestions: {
        type: Sequelize.INTEGER
      },
      HardQuestions: {
        type: Sequelize.INTEGER
      },
      TotalQuestions: {
        type: Sequelize.INTEGER
      },
      TotalMarks: {
        type: Sequelize.INTEGER
      },
      Instructions: {
        type: Sequelize.TEXT
      },
      QuizzCategoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'User',
          key: 'id'
        },
        onDelete: 'NO ACTION',
        onUpdate: 'CASCADE'
      },
      BatchId: {
        type: Sequelize.TEXT,
        references: {
          model: 'Batches',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      CourseId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Courses',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Quizes');
  }
};
