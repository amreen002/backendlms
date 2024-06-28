'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Batch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'userId' }); 
      this.belongsTo(models.Courses, { foreignKey: 'CoursesId' }); 
      this.belongsTo(models.Teacher, { foreignKey: 'InstructorId' }); 
      this.hasMany(models.Quize, { foreignKey: 'BatchId' }); 
      this.hasMany(models.Student, { foreignKey: 'BatchId' });
    }
  }
  Batch.init({
    Title: {
      field: 'Title',
      type: DataTypes.STRING
    },
    userId:{
      field: 'userId',
      type: DataTypes.INTEGER,
    },
    BatchEniqueId: {
      field: 'BatchEniqueId',
      type: DataTypes.STRING
    },
    InstructorId: {
      field: 'InstructorId',
      type: DataTypes.INTEGER
    },
    CoursesId: {
      field: 'CoursesId',
      type: DataTypes.INTEGER
    },
    BatchDuration: {
      field: 'BatchDuration',
      type: DataTypes.STRING
    },
    BatchStartTime: {
      field: 'BatchStartTime',
      type: DataTypes.TIME
    },
    BatchEndTime: {
      field: 'BatchEndTime',
      type: DataTypes.TIME
    },
    BatchsInWeek: {
      field: 'BatchsInWeek',
      type: DataTypes.STRING
    },
    StartedAtWeek: {
      field: 'StartedAtWeek',
      type: DataTypes.DATEONLY
    },
    BatchStatus: {
      field: 'BatchStatus',
      type: DataTypes.ENUM('Open','Close')
    },
    BatchDatails: {
      field: 'BatchDatails',
      type: DataTypes.TEXT('long')
    },
  }, {
    sequelize,
    modelName: 'Batch',
    tableName: 'batches',

  });
  return Batch;
};