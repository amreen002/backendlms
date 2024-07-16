'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Address, {
        foreignKey: 'AddressableId',
        constraints: false,
      });
      this.belongsTo(models.User, { foreignKey: 'roleId' });
      this.belongsTo(models.Courses, { foreignKey: 'CoursesId' });
      this.belongsTo(models.Batch, { foreignKey: 'BatchId' });
      this.hasMany(models.Questions, { foreignKey: 'studentId' });
      this.hasMany(models.StudentQuize, { as: 'StudentQuizes', foreignKey: 'StudentId' });
    }
  }
  Student.init({
    Name: {
      field: 'Name',
      type: DataTypes.STRING
    },
    LastName: {
      field: 'LastName',
      type: DataTypes.STRING
    },
    AddressableId: {
      field: 'AddressableId',
      type: DataTypes.INTEGER,
    },
    Email: {
      field: 'Email',
      type: DataTypes.STRING
    },
    Password: {
      field: 'Password',
      type: DataTypes.STRING
    },
    Username: {
      field: 'Username',
      type: DataTypes.STRING
    },
    PhoneNumber: {
      field: 'PhoneNumber',
      type: DataTypes.BIGINT
    },
    roleId: {
      field: 'roleId',
      type: DataTypes.INTEGER
    },
    Date: {
      field: 'Date',
      type: DataTypes.DATEONLY
    },
    CoursesId:{
      field: 'CoursesId',
      type: DataTypes.INTEGER,
    },
    BatchId:{
      field: 'BatchId',
      type: DataTypes.INTEGER,
    },
  

  }, {
    sequelize,
    modelName: 'Student',
    tableName: 'students',
  });
  return Student;
};