'use strict';

const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsTo(models.Role, { foreignKey: 'departmentId' });    
      this.hasMany(models.SaleTeam, { foreignKey: 'roleId' });   
      this.hasMany(models.TelecallerDepartment, { foreignKey: 'roleId' });  
      this.hasMany(models.FrontDesk, { foreignKey: 'roleId' }); 
      this.hasMany(models.Teacher, { foreignKey: 'roleId' }); 
      this.hasMany(models.Student, { foreignKey: 'roleId' }); 
      this.hasMany(models.Courses, { foreignKey: 'userId' });  
      this.hasMany(models.Batch, { foreignKey: 'userId' });  
      this.hasMany(models.Quize, { foreignKey: 'userId' }); 
      this.hasMany(models.Categories, { foreignKey: 'userId' });  
      this.hasMany(models.Questions, { foreignKey: 'userId' }); 
      this.hasMany(models.Topic, { foreignKey: 'userId' }); 
      this.hasMany(models.Lession, { foreignKey: 'userId' });
      this.hasMany(models.Video, { foreignKey: 'userId' });
      this.belongsTo(models.Address, {
        foreignKey: 'AddressableId',
        constraints: false,
      });
    }
  }
  User.init({
    name: {
      type: DataTypes.STRING
    },
    userName: {
      type: DataTypes.STRING
    },
    phoneNumber: {
      type: DataTypes.BIGINT,
      defaultValue:0
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    resentPassword: {
      type: DataTypes.STRING
    },
    passwordResetOtp: {
      type: DataTypes.STRING
    },
    expireToken: {
      type: DataTypes.STRING
    },
    assignToUsers:{
      type: DataTypes.INTEGER
    },
    departmentId: {
      type:DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    teacherId: {
      type:DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    studentId: {
      type:DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    AddressableId: {
      type:DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    roleName: {
      type: DataTypes.ENUM('Super Admin','Admin','Sub Admin')
    },
    image: {
      type: DataTypes.STRING
    },
    src: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING
    },
    message: {
      type: DataTypes.TEXT('long')
    },
    active: {
      type: DataTypes.BOOLEAN,  //default value is false if not mentioned otherwise
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  });
  return User;
};