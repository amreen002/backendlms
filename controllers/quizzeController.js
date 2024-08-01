
const { Op, fn, col } = require('sequelize');
const { Quize, Role, User, Categories, Teacher, Batch, sequelize, Questions,Courses,Student,CategoriesQuestion} = require('../models')
let paginationfun = require("../controllers/paginationController");
exports.create = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        req.body.userId = req.profile.id;

        /*        // Parsing the questions
               const EasyQuestions = JSON.parse(req.body.EasyQuestions);
               const MediumQuestions = JSON.parse(req.body.MediumQuestions);
               const HardQuestions = JSON.parse(req.body.HardQuestions);
       
               // Calculating total questions and marks
               const totalQuestions = EasyQuestions.length + MediumQuestions.length + HardQuestions.length;
               const totalMarks = (EasyQuestions.length * 1) + (MediumQuestions.length * 2) + (HardQuestions.length * 4);
       
               req.body.TotalQuestions = totalQuestions;
               req.body.TotalMarks = totalMarks; */

        const quizze = await Quize.create(req.body, { transaction });
        await transaction.commit();
        return res.status(200).json({
            quizze: quizze,
            success: true,
            message: "Quiz Created Successfully"
        });
    } catch (error) {
        console.error(error);
        await transaction.rollback();
        return res.status(500).json({
            error: error.message,
            success: false,
            message: "Quiz creation error"
        });
    }
}

exports.findOne = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        const quizze = await Quize.findOne({ where: { id: req.params.quizzeId }, include: [{ model: User, include: [{ model: Role }] }, { model: Categories }, { model: Batch },{ model: Questions }], transaction });
        await transaction.commit();
        res.status(200).json({
            quizze: quizze,
            success: true,
            message: "get one Quizze by ID"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Quizze'
        });
    }
}
exports.QuestionWisefindOne = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const quizzeandquesation = await Questions.findAll({
            where: {
                QuizzeId:req.params.quizzeId,id:req.params.questionId,
            },
            include: [
                { model: CategoriesQuestion },
                { model: Quize }
            ],
            transaction
        });

        await transaction.commit();

        res.status(200).json({
            quesations: quizzeandquesation,
            success: true,
            message: "Get one Quizze and Questions by ID"
        });
    } catch (error) {
        console.log(error);
        await transaction.rollback();

        res.status(500).json({
            error: error.message,
            success: false,
            message: 'Error in getting the Quizze'
        });
    }
};

exports.findAll = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        let where;
        let subQuery =false
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
        if (loggedInUser.Role.Name == "Admin" || loggedInUser.Role.Name == "Administrator" ||loggedInUser.Role.Name == "Super Admin")
            where = {}
        else {
            where = { userId: loggedInUserId }
        }
        const conditions2 = {
            where,
            include: [
                { model: User, include: [{ model: Role }] },
                { model: Categories },
                { model: Batch },
                { model: Courses },
                { model: Questions , include: [{ model: Student }] }
            ],
            order: [['updatedAt', 'DESC']],
            subQuery,
            transaction
        }
        /* 
                const formatTimeToAMPM = (timeString) => {
                    const date = new Date(timeString);
                    const dateFullYear = String(date.getDate()).padStart(2, '0') + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" +  date.getFullYear() ;
                    const [hours, minutes] = timeString.slice(0, 19).replace('T', ' ');
                    const period = hours >= 12 ? 'PM' : 'AM';
                    const formattedHours = hours % 12 || 12;
                    return `${dateFullYear} ${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
                };
        
                for (let index = 0; index < quizze.length; index++) {
                    quizze[index].QuizzStartTime = formatTimeToAMPM(quizze[index].QuizzStartTime);
                    quizze[index].QuizzEndTime = formatTimeToAMPM(quizze[index].QuizzEndTime);
                } */

        const obj = {
            page: req.query.page,
            model: Quize,
            headers: req.headers.host,
            split: req.url.split("?")[0],
            condtion: conditions2,
            whereData: where
        }
        const quizze = await paginationfun.pagination(obj)
        await transaction.commit();
        if (quizze) {
        return res.status(200).json({
            quizze:quizze,
            success:quizze.rows.length ? true : false,
            message:quizze.rows.length ? "Get All Quizze Data Success":"No data Found"
        })
       }
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return res.status(500).json({
            error: error,
            success: false,
            message: "Get All Quizze Data Failed"
        });
    }
}

exports.update = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        req.body.userId = req.profile.id;
        /*         const EasyQuestions = JSON.parse(req.body.EasyQuestions);
                const MediumQuestions = JSON.parse(req.body.MediumQuestions);
                const HardQuestions = JSON.parse(req.body.HardQuestions);
                let dataTolota = EasyQuestions + MediumQuestions + HardQuestions
                let totalmarks
                req.body.TotalQuestions = dataTolota
                totalmarks = (EasyQuestions * 1) + (MediumQuestions * 2) + (HardQuestions * 4)
                req.body.TotalMarks = totalmarks */
        const quizze = await Quize.update(req.body, { where: { id: req.params.quizzeId }, transaction });
        await transaction.commit();
        res.status(200).json({
            quizze: quizze,
            success: true,
            message: "Update Successfully Quizze"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Quizze"
        });
    }

}

exports.QuestionWiseUpdate = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        await Questions.update(req.body, { where: { QuizzeId: req.params.quizzeId,id: req.params.questionId}, transaction });
        await transaction.commit();
        res.status(200).json({
            success: true,
            message: "Update Successfully Quizze"
        });
    } catch (error) {
        console.log(error);
        if (transaction) await transaction.rollback();
        res.status(500).json({
            error: error.message,
            success: false,
            message: "Error While Updating The Quizze"
        });
    }
}

exports.delete = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        const quizze = await Quize.destroy({ where: { id: req.params.quizzeId }, transaction });
        await transaction.commit();
        res.status(200).json({
            quizze: quizze,
            success: true,
            message: "Delete Successfully Quizze"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'Quizze not found'
        });
    }
}

