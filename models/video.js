'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Courses, { foreignKey: 'CoursesId' });
      this.belongsTo(models.Topic, { foreignKey: 'TopicId' });
      this.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Video.init({
    Title: {
      field: 'Title',
      type: DataTypes.STRING
    },
    CoursesId:{ 
      field: 'CoursesId', 
      type: DataTypes.INTEGER
     },
    TopicId:{ 
      field: 'TopicId', 
      type: DataTypes.INTEGER
     },
    VideoUplod: { 
      field: 'VideoUplod', 
      type: DataTypes.JSON
     },
    VideoIframe: { 
      field: 'VideoIframe', 
      type: DataTypes.STRING
     },
     userId:{
      field: 'userId', 
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Video',
    tableName: 'videos',
  });
  return Video;
};