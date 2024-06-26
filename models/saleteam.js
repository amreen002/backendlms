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
    }
  }
  SaleTeam.init({
    date: {
      type: DataTypes.DATEONLY,
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
    modelName: 'SaleTeam',
    tableName: 'saleteams',
  });
  return SaleTeam;
};