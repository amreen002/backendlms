
const {TelecallerDepartment, Topic ,User ,Courses,Role,sequelize} = require('../models')
let paginationfun = require("../controllers/paginationController");
exports.create = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        req.body.userId=req.profile.id
        const topic = await Topic.create(req.body,{transaction})
        await transaction.commit();
        return res.status(200).json({
            topic: topic,
            success: true,
            message: "Topic Created SuccessFully"
        })
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        return res.status(500).json({
            error: error,
            success: false,
            message: "Topic  error"
        })
    }

}

exports.findOne = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const topic = await Topic.findOne({ where: { id: req.params.topicId},include: [ { model: Courses }],transaction});
        await transaction.commit();
        res.status(200).json({
            topic: topic,
            success: true,
            message: "get one Topic by ID"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Topic'
        });
    }
}

exports.findAll = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        let where;
        let subQuery = false
        const loggedInUserId = req.profile.id;
        const loggedInUser = await User.findOne({
            where: { id: loggedInUserId }, attributes: [
                "id",
                "name",
                "userName",
                "phoneNumber",
                "email",
                "assignToUsers",
                "departmentId",
                "teacherId",
                "studentId",
                "roleName",
                "image",
                "src",
                "address",
                "message",
                "active",
            ], include: [{ model: Role }],
            transaction

        });
        if (loggedInUser.Role.Name == "Admin" || loggedInUser.Role.Name == "Administrator"||loggedInUser.Role.Name == "Super Admin")
            where = {}
        else {
            where = { userId: loggedInUserId }
        }
        let conditions2 = {
            where,
            include: [{ model: Courses }],
            order: [['updatedAt', 'DESC']],
            subQuery: subQuery
        }


        const obj = {
            page: req.query.page,
            model: Topic,
            headers: req.headers.host,
            split: req.url.split("?")[0],
            condtion: conditions2,
            whereData: where
        }

    
    
        const topic = await paginationfun.pagination(obj)
        await transaction.commit();
        if (topic) {
            return res.status(200).json({
                success: topic.rows.length ? true : false,
                message: topic.rows.length ? "Get All Topic Data Success" : "No data Found",
                topic: topic,
            })
        }
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "Get Not All  Topic Data Success"
        });
    }
}

exports.update = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        req.body.userId=req.profile.id
        const topic = await Topic.update(req.body, { where: { id: req.params.topicId },transaction });
        await transaction.commit();
        res.status(200).json({
            topic: topic,
            success: true,
            message: "Update Successfully Topic"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Topic"
        });
    }

}

exports.delete = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        // Attempt to delete the topic
        const topic = await Topic.destroy({ where: { id: req.params.topicId }, transaction });

        // If no rows were affected, the topic was not found
        if (!topic) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }

        await transaction.commit();
        res.status(200).json({
            success: true,
            message: "Deleted Subject successfully"
        });
    } catch (error) {
        console.log(error);

        // Check if the error is a foreign key constraint error
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Cannot delete subject because it is referenced by module. Please remove the associated module first.'
            });
        }

        await transaction.rollback();
        res.status(500).json({
            success: false,
            message: 'An error occurred while deleting the subject',
            error: error
        });
    }
};



