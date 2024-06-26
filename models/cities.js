'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Address, {
        foreignKey: 'DistrictId',
        constraints: false
      }); 
      this.belongsTo(models.Staties, {
        foreignKey: 'stateswithcityId',
        constraints: false
      });
    }
  }
  Cities.init({
    name: DataTypes.STRING,
    stateswithcityId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cities',
    tableName: 'cities',
  });
  return Cities;
};