'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
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
      this.hasMany(models.Batch, { foreignKey: 'InstructorId' });  
    }
  }
  Teacher.init({
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
    DOB: {
      field: 'DOB',
      type: DataTypes.DATEONLY
    },
    TeacherType: {
      field: 'TeacherType',
      type: DataTypes.ENUM("Online","Offline")
    },
    Username: {
      field: 'Username',
      type: DataTypes.STRING
    },
    PhoneNumber: {
      field: 'PhoneNumber',
      type: DataTypes.BIGINT
    },
    YourIntroducationAndSkills: {
      field: 'YourIntroducationAndSkills',
      type: DataTypes.TEXT('long')
    },
    roleId: {
      field: 'roleId',
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Teacher',
    tableName: 'teachers',
  });
  return Teacher;
};