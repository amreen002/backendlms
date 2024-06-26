'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Questions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Quize, { foreignKey: 'QuizzeId' });
      this.belongsTo(models.CategoriesQuestion, { foreignKey: 'CategoryId' });
    }
  }
  Questions.init({
    Questions: {
      field: 'Questions',
      type: DataTypes.TEXT('long'),
    },
    Type: {
      field: 'Type',
      type: DataTypes.ENUM('Easy','Medium','Hard')
    },
    QuizzeId:{
      field: 'QuizzeId',
      type: DataTypes.INTEGER
    },
    CategoryId:{
      field: 'CategoryId',
      type: DataTypes.INTEGER
    },
    Options1: {
      field: 'Options1',
      type: DataTypes.STRING
    },
    Options2:{
      field: 'Options2',
      type: DataTypes.STRING
    },
    Options3:{
      field: 'Options3',
      type: DataTypes.STRING
    },
    Options4:{
      field: 'Options4',
      type: DataTypes.STRING
    },
    Answer:{
      field: 'Answer',
      type: DataTypes.JSON
    },
  }, {
    sequelize,
    modelName: 'Questions',
    tableName: 'questions',
  });
  return Questions;
};