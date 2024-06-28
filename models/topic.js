'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Topic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Courses, { foreignKey: 'CoursesId' });
      this.belongsTo(models.User, { foreignKey: 'userId' });
      this.hasMany(models.Lession, { foreignKey: 'TopicId' });
      this.hasMany(models.Video, { foreignKey: 'TopicId' });
    }
  }
  Topic.init({
    name:  {
      field: 'name',
      type: DataTypes.STRING,
    },
    CoursesId: {
      field: 'CoursesId',
      type: DataTypes.INTEGER
    },
    userId:{
      field: 'userId', 
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Topic',
    tableName: 'topics',
  });
  return Topic;
};