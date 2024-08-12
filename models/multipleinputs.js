'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Multipleinput extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Multipleinput.init({
    checkedInputs: {
      type: DataTypes.JSON
    },
    userId: {
      field: 'userId',
      type: DataTypes.INTEGER
    },
    type:{
      field: 'type',
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Multipleinput',
    tableName: 'multipleinputs',
  });
  return Multipleinput;
};