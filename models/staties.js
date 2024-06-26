'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Staties extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Address, {
        foreignKey: 'StateId',
        constraints: false,
        as: 'Address'
      }); 
      this.hasMany(models.Cities, {
        foreignKey: 'stateswithcityId',
        constraints: false
      }); 
      this.belongsTo(models.Countries, {
        foreignKey: 'countryId',
        constraints: false,
        as: 'Countries'
      });
     
    }
  }
  Staties.init({
    name: DataTypes.STRING,
    countryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Staties',
    tableName: 'staties',
  });
  return Staties;
};