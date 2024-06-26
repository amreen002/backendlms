'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPermissionRoles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Role, { foreignKey: 'RoleId' });    
    }
  }
  UserPermissionRoles.init({
    modelName:{
      field: 'modelName',
      type: DataTypes.STRING,
      allowNull: true
    },
    RoleId: {
      field: 'RoleId',
      type: DataTypes.INTEGER,
      allowNull: true
    },
    UserId: {
      field: 'UserId',
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Create: {
      field: 'Create',
      type: DataTypes.BOOLEAN,
      defaultValue:0
    },
    Read: {
      field: 'Read',
      type: DataTypes.BOOLEAN,
      defaultValue:0
    },
    Update: {
      field: 'Update',
      type: DataTypes.BOOLEAN,
      defaultValue:0

    },
    Delete: {
      field: 'Delete',
      type: DataTypes.BOOLEAN,
      defaultValue:0
    },

  }, {
    sequelize,
    modelName: 'UserPermissionRoles',
    tableName: 'userpermissionroles',
  });
  return UserPermissionRoles;
};