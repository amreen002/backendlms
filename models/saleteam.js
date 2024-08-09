'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
  class SaleTeam extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'roleId' });
      this.belongsTo(models.Address, {
        foreignKey: 'AddressableId',
        constraints: false,
      });
      this.belongsTo(models.Courses, {
        foreignKey: 'courseId',
        constraints: false,
      });
    }
  }
  SaleTeam.init({
    date: {
      type: DataTypes.DATEONLY,
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
      type:DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    phoneNumber: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
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
    remark: {
      type: DataTypes.TEXT('long')
    },
    status: {
      type: DataTypes.ENUM('1st Call', '2nd Call', '3rd Call', '4rd Call', 'Not Responding (N/R)', 'Other'),
    },
    lead_status: {
      type: DataTypes.STRING
    },
    WhatsApp:{
      field: 'WhatsApp',
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
    },
    TelecallerCheckbox: {
      field: 'TelecallerCheckbox',
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },


  }, {
    sequelize,
    modelName: 'SaleTeam',
    tableName: 'saleteams',
  });
  return SaleTeam;
};