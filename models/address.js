'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Student, { foreignKey: 'AddressableId' ,   constraints: false});  
      this.hasMany(models.Teacher, { foreignKey: 'AddressableId' ,   constraints: false});  
      this.hasMany(models.FrontDesk, { foreignKey: 'AddressableId' ,   constraints: false});  
      this.hasMany(models.SaleTeam, { foreignKey: 'AddressableId' ,   constraints: false});  
      this.belongsTo(models.Countries, {
        foreignKey: 'CountryId',
        constraints: false,
        as: 'Countries'
      });
      this.belongsTo(models.Staties, {
        foreignKey: 'StateId',
        constraints: false,
        as: 'Staties'
      });
      this.belongsTo(models.Cities, {
        foreignKey: 'DistrictId',
        constraints: false,
        as: 'Cities'
      });
      this.belongsTo(models.User, {
        foreignKey: 'AddressableId',
        constraints: false,
      });
    }
  };
  Address.init({
    AddressableType: {
      field: 'AddressableType',
      type: DataTypes.STRING,
    },
    AddressableId: {
      field: 'AddressableId',
      type: DataTypes.INTEGER,
      allowNull: false
    },
    AddressType: {
      field: 'AddressType',
      type: DataTypes.STRING,
    },
    PostalCode: {
      field: 'PostalCode',
      type: DataTypes.INTEGER,
    },
    Address: {
      field: 'Address',
      type: DataTypes.TEXT,
    },
    City: {
      field: 'City',
      type: DataTypes.STRING,
    },
    DistrictId: {
      field: 'DistrictId',
      type: DataTypes.INTEGER,
    },
    StateId: {
      field: 'StateId',
      type: DataTypes.INTEGER,
    },
    CountryId: {
      field: 'CountryId',
      type: DataTypes.INTEGER,
    },
    IsSame: {
      field: 'IsSame',
      type: DataTypes.BOOLEAN,
    },
    Area: {
      field: 'Area',
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Address',
    tableName: 'addresses',
  });
  return Address;
};