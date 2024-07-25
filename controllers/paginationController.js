const { Op, fn, col } = require('sequelize');
const { Questions, Quize, Role, User, CategoriesQuestion, sequelize, Courses, Student, StudentQuize } = require('../models')
let paginationfun = require("../controllers/paginationController");

exports.pagination = async function myFunction(data, res) {
    const url = {};
    const page = parseInt(data.page ? data.page - 1 : 0);
    let selectedCount;
    if (data.QueryCount!=undefined) {
        selectedCount=(await this.callRawSqlQuery(data.QueryCount))[0].count;
    }
    else if(data.conditionForCount){
        selectedCount = await data.model.count(data.conditionForCount);
    }
    else {
        data.condtion.distinct = true
        selectedCount = await data.model.count(data.condtion);
    }
    let totalPage = 1

    if (selectedCount % 10 != 0) {
        totalPage = Math.floor(selectedCount / 10) + 1;
    } else {
        totalPage = Math.floor(selectedCount / 10)
    }
    startPage = page - 4;
    endPage = page + 4;
    if (startPage <= 0) {
        endPage -= (startPage - 1);
        startPage = 1;
    }
    if (endPage > totalPage) {
        endPage = totalPage;
    }
    if (startPage > 1) {
        url.first = data.headers + "/api" + data.split + "?page=1";
    }
    for (i = startPage; i <= endPage; i++) {
        url[i] = data.headers + "/api" + data.split + "?page=" + i;
    }

    if (endPage < totalPage) {
        url.last = data.headers + "/api" + data.split + "?page=" + totalPage;
    }
   
    let selectedData;

     if(data.Query!=undefined){ 
     selectedData=await this.callRawSqlQuery(data.Query);
    }
    else if (Object.keys(data.condtion).length) {
        data.condtion.raw = false
        data.condtion.limit = 10
        data.condtion.offset = (page * 10)
        selectedData = await data.model.findAll(data.condtion);
    }
/*     else {
        let sql = (
            `SELECT  user1.id, user1.name,user1.email,user1.email, user1.gender,user1.phone,user1.alternate_phone,user1.slug,user1.role_id,user1.is_active,user1.is_applicable,user1.created_at,user1.updated_at,
        (select json_arrayagg(JSON_OBJECT('id',project.id,'name', project.name)) from (select DISTINCT p1.id,p1.name from project__department__users pd1 left join projects p1 on p1.id = pd1.project_id where pd1.user_id = user1.id) as project)as Projects,
        (select json_arrayagg(JSON_OBJECT('id',department.id,'name', department.name)) from (select DISTINCT p1.id,p1.name from project__department__users pd1 left join departments p1 on p1.id = pd1.department_id where pd1.user_id = user1.id) as department)as Departments,
        JSON_OBJECT('id',r1.id,'name', r1.name) as Role
        
        FROM users as user1
        LEFT JOIN roles r1
        ON user1.role_id = r1.id where user1.name !='Super Admin' group by user1.id order by r1.name ${data.orderBy} limit ${page * 10},10
       `);
        selectedData=await this.callRawSqlQuery(sql);

    } */

       /*
    get total amount of some feild for sale api
    */
    if(data.QueryCount!=undefined&& (await this.callRawSqlQuery(data.QueryCount))[0].allSalesTotaAmounts){
      const totalAmountOfSomeColumns=  await this.callRawSqlQuery(data.QueryCount)
       obj = {
        ack: 0,
        rows: selectedData,
        url: url,
        totalcountData: selectedCount,
        totalPage: totalPage,
    }
    return Object.assign(obj,totalAmountOfSomeColumns[0])
    }else{
    return obj = {
        ack: 0,
        rows: selectedData,
        url: url,
        totalcountData: selectedCount,
        totalPage: totalPage
    }
 }


}