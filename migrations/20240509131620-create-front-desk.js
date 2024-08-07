'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('frontdesks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATEONLY
      },
      uniqueId: {
        type: Sequelize.INTEGER
      },
      enquiryId: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.ENUM('Female', 'Male', 'Other'),
      },
      age: {
        type: Sequelize.INTEGER
      },
      workingStatus: {
        type: Sequelize.STRING
      },
      AddressableId: {
        field: 'AddressableId',
        type: Sequelize.INTEGER
      },
      address: {
        type: Sequelize.STRING
      },
      Education: {
        field: 'Education',
        type: Sequelize.ENUM('Education', 'School', 'Graduation', 'Master', 'Any other Skill')
      },
      courseId: {
        field: 'courseId',
        type: Sequelize.INTEGER,       
      },
      AssignEnquiry: {
        field: 'AssignEnquiry',
        type: Sequelize.STRING
      },
      roleId: {
        field: 'roleId',
        type: Sequelize.INTEGER
      },
      phoneNumber: {
        type: Sequelize.BIGINT
      },
      email: {
        type: Sequelize.STRING
      },
      visitDate:
      {
        type: Sequelize.DATEONLY
      },
      remark: {
        type: Sequelize.TEXT('long')
      },
      CounselingDepartmentAllotted: {
        field: 'CounselingDepartmentAllotted',
        type: Sequelize.STRING
      },
      CounselorName: {
        field: 'CounselorName',
        type: Sequelize.STRING
      },
      CounselorRoomNo: {
        field: 'CounselorRoomNo',
        type: Sequelize.STRING
      },
      TelecallerCheckbox: {
        field: 'TelecallerCheckbox',
        type: Sequelize.BOOLEAN,
        defaultValue:0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('frontdesks');
  }
};