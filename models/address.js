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
      allowNull: false
    },
    PostalCode: {
      field: 'PostalCode',
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Address: {
      field: 'Address',
      type: DataTypes.TEXT,
      allowNull: false
    },
    City: {
      field: 'City',
      type: DataTypes.STRING,
      allowNull: false
    },
    DistrictId: {
      field: 'DistrictId',
      type: DataTypes.INTEGER,
      allowNull: true
    },
    StateId: {
      field: 'StateId',
      type: DataTypes.INTEGER,
      allowNull: false
    },
    CountryId: {
      field: 'CountryId',
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IsSame: {
      field: 'IsSame',
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    Area: {
      field: 'Area',
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Address',
    tableName: 'addresses',
  });
  return Address;
};