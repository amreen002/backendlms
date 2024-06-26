'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
  class TelecallerDepartment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'roleId' });  
    }
  }
  TelecallerDepartment.init({
    date: {
      type: DataTypes.DATEONLY,
    },
    TelecallerCheckbox: {
      field: 'TelecallerCheckbox',
      type: DataTypes.BOOLEAN,
      defaultValue:0
    },
    enquiryId: {
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    roleId: {
      type: DataTypes.INTEGER
    },
    age: {
      type: DataTypes.INTEGER
    },
    phoneNumber: {
      type: DataTypes.BIGINT
    },
    email: {
      type: DataTypes.STRING
    },
    workingStatus: {
      type: DataTypes.STRING
    },
    leadPlatform: {
      type: DataTypes.STRING
    },
    telecallerPersonName: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('1st Call', '2nd Call', '3rd Call', '4rd Call', 'Not Responding (N/R)', 'Other'),
    },
    address: {
      type: DataTypes.STRING
    },
    userRoleName: {
      type: DataTypes.STRING
    },
    visitDate: {
      type: DataTypes.DATEONLY,
    },
    remark: {
      type: DataTypes.TEXT('long')
    }


  }, {
    sequelize,
    modelName: 'TelecallerDepartment',
    tableName: 'telecallerdepartments',
  });
  return TelecallerDepartment;
};