module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Questions', // table name
        'studentId', // new field name
        {
          type: Sequelize.JSON,
          allowNull: true,
        }
      )
    ]);
  },

  down(queryInterface, Sequelize) {
    // logic for reverting the changes
    return Promise.all([
      queryInterface.removeColumn('Questions', 'studentId'),
    ]);
  },
};