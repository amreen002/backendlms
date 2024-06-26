'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Countries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Address, {
        foreignKey: 'CountryId',
        constraints: false,
        as: 'Address'
      });
      this.hasMany(models.Staties, { foreignKey: 'countryId' });  
    }
  }
  Countries.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Countries',
    tableName: 'countries',
  });
  return Countries;
};