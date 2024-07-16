const { sequelize, StudentQuize, Questions, User, Role } = require('../models'); // Ensure models are correctly imported

exports.create = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        let studentsquize
        const studentQuizEntries = req.body.answers.map(answer => ({
            QuizeId: req.body.QuizeId,
            QuestionId: answer.QuestionId,
            AnswersStudent: answer.AnswersStudent,
            StudentId: req.profile.id,
            TimeTaken: answer.TimeTaken,
        }));

        for (let studentQuiz of studentQuizEntries) {
            const question = await Questions.findOne({ where: { id: studentQuiz.QuestionId } });
            if (question.Answer === studentQuiz.AnswersStudent) {
                studentQuiz.Correct = 1;
                studentQuiz.Incorrect = 0;
            } else {
                studentQuiz.Correct = 0;
                studentQuiz.Incorrect = 1;
            }
            studentsquize= await StudentQuize.create(studentQuiz, { transaction });
        }
        await transaction.commit();

        return res.status(200).json({
            studentsquize:studentsquize,
            success: true,
            message: "Created successfully"
        });

    } catch (error) {
        console.error(error);
        await transaction.rollback();
        return res.status(500).json({
            error: error.message,
            success: false,
            message: "Error creating StudentQuize"
        });
    }
};




exports.findOne = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const studentsquize = await StudentQuize.findOne({ where: { id: req.params.studentsId }, order: [['updatedAt', 'DESC']], transaction });
        await transaction.commit();
        res.status(200).json({
            studentsquize: studentsquize,
            success: true,
            message: "get one Students Quize by ID"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Students Quize'
        });
    }
}

exports.findAll = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        let where;
        let studentsquize;
        const loggedInUserId = req.profile.id;
        const loggedInUser = await User.findOne({
            where: { id: loggedInUserId },
            attributes: [
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
            ],
            include: [{ model: Role }],
            transaction
        });

        if (loggedInUser.Role.Name == "Admin" || loggedInUser.Role.Name == "Administrator") {
            where = {};
        } else {
            where = { StudentId: loggedInUserId };
        }

        studentsquize = await StudentQuize.findAll({
            where,
            order: [['updatedAt', 'DESC']],
            transaction,
        });

        let totalIncorrectCount = 0;
        let totalCorrectCount = 0;
        let totalCount = studentsquize.length;

        // Sum the incorrect and correct counts
        studentsquize.forEach(quize => {
            const correct = quize.Correct ? 1 : 0; 
            const incorrect = quize.Incorrect ? 1 : 0; 
            totalIncorrectCount += parseInt(incorrect, 10) || 0;
            totalCorrectCount += parseInt(correct, 10) || 0;
        });

        await transaction.commit();
        res.status(200).json({
            studentsquize: studentsquize,
            totalCount: totalCount,
            totalIncorrectCount: totalIncorrectCount,
            totalCorrectCount: totalCorrectCount,
            success: true,
            message: "Get All Data Success"
        });
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "Failed to retrieve data"
        });
    }
};



