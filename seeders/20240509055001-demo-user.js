'use strict';

const { User, Role, UserPermissionRoles } = require('../models');
const bcrypt = require('bcrypt');
const path = require("path");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = '123';
    const hashedPassword = await bcrypt.hash(password, 10);
    let ArrayRole = ['Super Admin', 'Admin', 'Instructor', 'Student', 'Guest/Viewer', 'Sale Department', 'Telecaller Department', 'Telecaller Team', 'Front Desk', 'Counselor Department', 'Account Department','Administrator']
    // Find or create the role "Super Admin"
    let where = {};
    let department
    for (let index = 0; index < ArrayRole.length; index++) {
      department = await queryInterface.bulkInsert('roles', [{
        Name: ArrayRole[index],
        createdAt: new Date(),
        updatedAt: new Date(),
      }], { returning: true });
    }
    let departments = await Role.findOne({ where: { Name: 'Super Admin' } });
    let user;
    user = await queryInterface.bulkInsert('users', [{
      name: 'Super Admin',
      userName: 'SuperAdmin001',
      phoneNumber: '1234567890',
      email: 'superadmin@gmail.com',
      password: hashedPassword,
      departmentId: departments.id,
      roleName: 'Super Admin',
      assignToUsers: 1,
      image: '2024-04-30T06-55-47.882Z-2.jpg',
      src: path.join(__dirname, '..', 'uploads', '2024-04-30T06-55-47.882Z-2.jpg'),
      active: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], { returning: true });


    user = await User.findOne({ where, include: [{ model: Role, where: { name: 'Super Admin' } }] });
    let CoureseArray = ['Class 1st', 'Class 2nd', 'Class 3rd', 'Class 4th', 'Class 5th', 'Class 6th', 'Class 7th', 'Class 8th','Class 9th','Class 10th','Class 11th','Class 12th']
    let courses
    for (let index = 0; index < CoureseArray.length; index++) {
      courses = await queryInterface.bulkInsert('courses', [{
        name: CoureseArray[index],
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }], { returning: true });
    }
    let userAll = await User.findAll({ where, include: [{ model: Role }] });
    let userPermissionRoles
    let modelNameArray = ['Lead', 'User', 'Lead Allotted', 'Lead Allotted View']
    if (userAll[0].Role.Name == 'Super Admin') {
      for (let index = 0; index < modelNameArray.length; index++) {
        userPermissionRoles = await queryInterface.bulkInsert('userpermissionroles', [{
          RoleId: userAll[0].Role.id,
          UserId: userAll[0].id,
          modelName: modelNameArray[index],
          Create: 1,
          Read: 1,
          Update: 1,
          Delete: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }]);
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('roles', null, {});
    await queryInterface.bulkDelete('userpermissionroles', null, {});
  }
};

