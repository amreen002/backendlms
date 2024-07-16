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
      this.belongsTo(models.User, { foreignKey: 'userId' });
      this.belongsTo(models.Quize, { foreignKey: 'QuizzeId' });
      this.belongsTo(models.CategoriesQuestion, { foreignKey: 'CategoryId' });
      this.belongsTo(models.Student, { foreignKey: 'studentId' });
      this.hasMany(models.StudentQuize, { foreignKey: 'QuestionId' });
    }
  }
  Questions.init({
    Questions: {
      field: 'Questions',
      type: DataTypes.TEXT('long'),
    },
    Type: {
      field: 'Type',
      type: DataTypes.ENUM('Number of Easy Questions (1 Mark)','Number of Medium Questions (2 Mark)','Number of Hard Questions (4 Mark)')
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
    userId:{
      field: 'userId',
      type: DataTypes.INTEGER
    },
    studentId:{
      field: 'studentId',
      type: DataTypes.JSON
    },
   
    
  }, {
    sequelize,
    modelName: 'Questions',
    tableName: 'questions',
  });
  return Questions;
};