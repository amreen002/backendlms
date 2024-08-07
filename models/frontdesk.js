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
    uniqueId: {
      type: DataTypes.INTEGER
    },
    enquiryId: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
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
    AssignEnquiry: {
      field: 'AssignEnquiry',
      type: DataTypes.STRING
    },
    roleId: {
      field: 'roleId',
      type: DataTypes.INTEGER
    },
    phoneNumber: {
      type: DataTypes.BIGINT
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
    CounselingDepartmentAllotted: {
      field: 'CounselingDepartmentAllotted',
      type: DataTypes.STRING
    },
    CounselorName: {
      field: 'CounselorName',
      type: DataTypes.STRING
    },
    CounselorRoomNo: {
      field: 'CounselorRoomNo',
      type: DataTypes.STRING
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