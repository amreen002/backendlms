/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, remove the existing column
    await queryInterface.removeColumn('studentquizes', 'AnswersStudent');

    // Then, add the column back with the new type
    await queryInterface.addColumn('studentquizes', 'AnswersStudent', {
      type: Sequelize.JSON, // Change this to the desired type
      allowNull: true, // Adjust based on your needs
    });
  },

  down: async (queryInterface, Sequelize) => {
    // First, remove the column with the new type
    await queryInterface.removeColumn('studentquizes', 'AnswersStudent');

    // Then, add the column back with the previous type (e.g., STRING)
    await queryInterface.addColumn('studentquizes', 'AnswersStudent', {
      type: Sequelize.STRING, // Adjust this based on the previous column type
      allowNull: true, // Adjust based on your needs
    });
  },
};
