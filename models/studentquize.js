'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentQuize extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Questions, { foreignKey: 'QuestionId' });
      this.belongsTo(models.Student, { foreignKey: 'StudentId' });
      this.belongsTo(models.User, { foreignKey: 'StudentId' });
      this.belongsTo(models.Quize, { as: 'Quize', foreignKey: 'QuizeId' });
    }
  }
  StudentQuize.init({
    QuizeId: {
      field: 'QuizeId',
      type: DataTypes.INTEGER,
    },
    QuestionId: {
      field: 'QuestionId',
      type: DataTypes.INTEGER,
    },
    StudentId: {
      field: 'StudentId',
      type: DataTypes.INTEGER,
    },
    AnswersStudent: {
      field: 'AnswersStudent',
      type: DataTypes.STRING,
    },
    Incorrect: {
      field: 'Incorrect',
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    Correct: {
      field: 'Correct',
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    TimeTaken: {
      field: 'TimeTaken',
      type: DataTypes.TIME,
    },
    AnswersStudent: {
      field: 'AnswersStudent',
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'StudentQuize',
    tableName: 'studentquizes'
  });
  return StudentQuize;
};