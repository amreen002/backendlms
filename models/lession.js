'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lession extends Model {
    static associate(models) {
      this.belongsTo(models.Courses, { foreignKey: 'CoursesId' });
      this.belongsTo(models.Topic, { foreignKey: 'TopicId' });
      this.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Lession.init({
    LessionTitle: {
      field: 'LessionTitle',
      type: DataTypes.STRING,
    },
    CoursesId: {
      field: 'CoursesId',
      type: DataTypes.INTEGER
    },
    TopicId: {
      field: 'TopicId',
      type: DataTypes.INTEGER
    },
    LessionUpload: {
      field: 'LessionUpload',
      type: DataTypes.JSON,
    },
    userId:{
      field: 'userId', 
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Lession',
    tableName: 'lessions',
  });
  return Lession;
};