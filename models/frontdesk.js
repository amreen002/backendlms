'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
  class FrontDesk extends Model {
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
      this.belongsTo(models.Courses, {
        foreignKey: 'courseId',
        constraints: false,
      });
      this.belongsTo(models.User, {
        foreignKey: 'roleId',
        constraints: false
      });
    }
  }
  FrontDesk.init({
    date: {
      type: DataTypes.DATEONLY,
    },
    enquiryId: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    lastname: {
      type: DataTypes.STRING
    },
    username: {
      type: DataTypes.STRING
    },
    lead_status:{
      type: DataTypes.STRING
    },
    status: {
      field: 'status',
      type: DataTypes.ENUM('1st Call', '2nd Call', '3rd Call', '4rd Call', 'Not Responding (N/R)', 'Other'),
    },
    gender: {
      type: DataTypes.ENUM('Female', 'Male', 'Other'),
    },
    age: {
      type: DataTypes.INTEGER
    },
    workingStatus: {
      type: DataTypes.STRING
    },
    leadPlatform: {
      type: DataTypes.STRING
    },
    AddressableId: {
      field: 'AddressableId',
      type: DataTypes.INTEGER,
    },
    address: {
      type: DataTypes.STRING
    },
    Education: {
      field: 'Education',
      type: DataTypes.ENUM('Education', 'School', 'Graduation', 'Master', 'Any other Skill')
    },
    courseId: {
      field: 'courseId',
      type: DataTypes.INTEGER,
    },
    batchId:{
      field: 'batchId',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    roleId: {
      field: 'roleId',
      type: DataTypes.INTEGER
    },
    WhatsApp:{
      field: 'WhatsApp',
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
    },
    phoneNumber: {
      field: 'phoneNumber',
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
    },
    email: {
      type: DataTypes.STRING
    },
    visitDate: {
      type: DataTypes.DATEONLY,
    },
    remark: {
      type: DataTypes.TEXT('long')
    },

    TelecallerCheckbox: {
      field: 'TelecallerCheckbox',
      type: DataTypes.BOOLEAN,
      defaultValue:0
    },
  }, {
    sequelize,
    modelName: 'FrontDesk',
    tableName: 'frontdesks',
  });
  return FrontDesk;
};