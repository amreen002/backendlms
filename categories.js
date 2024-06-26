'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Quize, { foreignKey: 'QuizzCategoryId' }); 
      this.hasMany(models.Courses, { foreignKey: 'CourseCategoryId' }); 
      this.belongsTo(models.User, { foreignKey: 'userId' }); 
    }
  }
  categories.init({
    name: {type:DataTypes.STRING},
    userId:{type:DataTypes.INTEGER}
  }, {
    sequelize,
    modelName: 'categories',
    tableName: 'categories',
  });
  return categories;
};