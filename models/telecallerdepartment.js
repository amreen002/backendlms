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
    name: {
      type: DataTypes.STRING
    },
    lastname: {
      type: DataTypes.STRING
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    roleId: {
      type: DataTypes.INTEGER
    },
    courseId: {
      type:DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    batchId: {
      type:DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    AddressableId: {
      type:DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
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
    status: {
      type: DataTypes.ENUM('1st Call', '2nd Call', '3rd Call', '4rd Call', 'Not Responding (N/R)', 'Other'),
    },
    lead_status: {
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