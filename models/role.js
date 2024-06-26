'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.User, { foreignKey: 'departmentId' });
      this.hasMany(models.UserPermissionRoles, { foreignKey: 'RoleId' });  
      this.hasMany(models.SaleTeam, { foreignKey: 'roleId' });   
      this.hasMany(models.TelecallerDepartment, { foreignKey: 'roleId' });  
      this.hasMany(models.FrontDesk, { foreignKey: 'roleId' }); 
    }
  }
  Role.init({
    Name: {
      field: 'Name',
      type: DataTypes.STRING,
      allowNull: true
    },
/*     departmentId: {
      type:DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },  */
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
  });
  return Role;
};