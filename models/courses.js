'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Courses extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId' });
      this.belongsTo(models.Categories, { foreignKey: 'CourseCategoryId' });
      this.hasMany(models.Batch, { foreignKey: 'CoursesId' });
      this.hasMany(models.Student, { foreignKey: 'CoursesId' });
      this.hasMany(models.FrontDesk, { foreignKey: 'coursesId' });
      this.hasMany(models.Topic, { foreignKey: 'CoursesId' });
      this.hasMany(models.Lession, { foreignKey: 'CoursesId' });
      this.hasMany(models.Video, { foreignKey: 'CoursesId' });
      this.hasMany(models.Quize , { foreignKey: 'CourseId' });
    }
    
  }
  Courses.init({
    name: {
      type: DataTypes.STRING
    },
    userId:{
      type: DataTypes.INTEGER,
    },
    CoursePrice: {
      field: 'CoursePrice',
      type: DataTypes.DOUBLE(25, 2),
    },
    CourseCategoryId: {
      field: 'CourseCategoryId',
      type: DataTypes.INTEGER,
    },
    CourseDuration :{
      field: 'CourseDuration',
      type: DataTypes.STRING,    
    },
    CourseCode:{
      field: 'CourseCode',
      type: DataTypes.STRING,
    },
    CourseUplod:{
      field: 'CourseUplod',
      type: DataTypes.STRING,    
    },
    Status:{
      field: 'Status',
      type: DataTypes.BOOLEAN,   
      defaultValue:0
    },
    AboutCourse:{
      field: 'AboutCourse',
      type: DataTypes.TEXT('long'),   
    },
    Description:{
      field: 'Description',
      type: DataTypes.TEXT('long'),   
    }

  }, {
    sequelize,
    modelName: 'Courses',
    tableName: 'courses',
  });
  return Courses;
};