const { Op, fn, col } = require('sequelize');
const { Questions, Quize, Role, User, CategoriesQuestion, sequelize, Courses, Student, StudentQuize } = require('../models')

exports.create = async (req, res) => {
    let transaction;
  
    try {
      // Initialize the transaction
      transaction = await sequelize.transaction();
  
      // Add userId from the profile to the request body
      req.body.userId = req.profile.id;
  
      // Ensure studentId is an array, if it's not already
      let studentIds = Array.isArray(req.body.studentId) ? req.body.studentId : [req.body.studentId];
  
      // Create the question record with the transaction
      const question = await Questions.create({ ...req.body, studentId: studentIds }, { transaction });
  
      // Commit the transaction
      await transaction.commit();
  
      return res.status(200).json({
        question,  // Return the created question
        success: true,
        message: "Question created successfully"
      });
    } catch (error) {
      // Rollback the transaction in case of an error
      if (transaction) {
        await transaction.rollback();
      }
  
      console.error(error);
  
      return res.status(500).json({
        error: error.message,
        success: false,
        message: "Error creating question"
      });
    }
  };
  


exports.findOne = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        const questions = await Questions.findOne({ where: { id: req.params.questionId }, include: [{ model: CategoriesQuestion }, { model: Quize }], transaction });
        await transaction.commit();
        res.status(200).json({
            questions: questions,
            success: true,
            message: "get one Questions by ID"
        });
    } catch (error) {
        console.log(error)
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Questions'
        });
    }
}



exports.findAll = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        let where;
        let questions;
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

        if (loggedInUser.Role.Name == "Admin" || loggedInUser.Role.Name == "Administrator")
            where = {}
        else {
            where = { userId: loggedInUserId }
        }

        if (req.query.student && loggedInUser.Role.Name === "Student") {
            const studentId = loggedInUser.studentId.toString();
            const query = `
            SELECT 
                q.id,
                q.Questions,
                q.QuizzeId,
                q.Options1,
                q.Options2,
                q.Options3,
                q.Options4,
                q.Answer,
                q.Type,
                q.studentId,
                JSON_OBJECT('id', cq.id, 'name', cq.name) AS CategoriesQuestion,
                JSON_OBJECT('id', u.id, 'name', u.name) AS User,
                JSON_OBJECT(
                    'id', qz.id,
                    'QuizzName', qz.QuizzName,
                    'TotalQuestions', qz.TotalQuestions,
                    'QuizzTestDuration', qz.QuizzTestDuration,
                    'userId', qz.userId,
                    'BatchId', qz.BatchId,
                    'QuizzCategoryId', qz.QuizzCategoryId,
                    'CourseId', qz.CourseId,
                    'TotalMarks', qz.TotalMarks,
                    'Questions', (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', inner_q.id,
                                'Questions', inner_q.Questions,
                                'QuizzeId', inner_q.QuizzeId,
                                'Options1', inner_q.Options1,
                                'Options2', inner_q.Options2,
                                'Options3', inner_q.Options3,
                                'Options4', inner_q.Options4,
                                'Answer', inner_q.Answer,
                                'Type', inner_q.Type,
                                'studentId', inner_q.studentId
                            )
                        )
                        FROM questions AS inner_q
                        WHERE inner_q.QuizzeId = qz.id
                    )
                ) AS Quize
            FROM questions q
            LEFT JOIN categoriesquestions cq ON q.CategoryId = cq.id
            LEFT JOIN quizes qz ON q.QuizzeId = qz.id
            LEFT JOIN users u ON q.userId = u.id
              WHERE JSON_CONTAINS(q.studentId, '["${studentId}"]', '$'); 
        `;
        

            questions = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT, transaction });
        } else {
            questions = await Questions.findAll({
                where,
                include: [
                    { model: CategoriesQuestion },
                    { model: Quize, include: [{ model: Courses }] },
                    { model: User },
                    { model: Student },
                    { model: StudentQuize }
                ],
                transaction
            });
        }

        await transaction.commit();
        return res.status(200).json({
            questions: questions,
            success: true,
            message: "Get All Questions Data Success"
        });
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return res.status(500).json({
            error: error.message,
            success: false,
            message: "Get Not All Questions Success"
        });
    }
};


exports.ReportsCard = async (req, res) => {
    let transaction;
    try {
        transaction = await sequelize.transaction();
        let where = {};

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

        if (loggedInUser.Role.Name === "Admin" || loggedInUser.Role.Name === "Administrator") {
            where = {};  // Admin or Administrator sees all questions
        } else {
            where = { userId: loggedInUserId };  // Other users see their own questions
        }

        const questions = await Questions.findAll({
            where,
            include: [
                { model: CategoriesQuestion },
                { model: Quize, include: [{ model: Courses }] },
                { model: StudentQuize, include: [{ model: User }] }  // Include student for each StudentQuize
            ],
            transaction
        });

        // Extract all StudentQuizes from all questions
        const allStudentQuizes = questions.flatMap(question => question.StudentQuizes);
        const studentQuizesGroupedByQuizId = allStudentQuizes.reduce((acc, sq) => {
            if (!acc[sq.QuizeId]) acc[sq.QuizeId] = [];
            acc[sq.QuizeId].push(sq);
            return acc;
        }, {});

        const quizReports = [];

        // Calculate statistics for each quiz
        for (const [quizId, studentQuizes] of Object.entries(studentQuizesGroupedByQuizId)) {
            // Get question IDs for the current quiz
            const questionIds = studentQuizes.map(sq => sq.QuestionId);

            // Fetch questions and include associated quiz and student data
            const datadata = await Questions.findAll({
                where: {
                    id: {
                        [Op.in]: questionIds
                    }
                },
                include: [
                    { model: Quize, where: { id: quizId }, include: [{ model: Courses }] },
                ],
                transaction,
            });

            const QuizName = datadata[0]?.Quize?.QuizzName || 'Unknown Quiz';
            const TotalQuizeMarks = datadata[0]?.Quize?.TotalMarks || 0;
            const TotalQuestions = datadata[0]?.Quize?.TotalQuestions || 0;
            const Class = datadata[0]?.Quize?.Course?.name || 'Unknown Class';
            const StudentNames = [...new Set(studentQuizes.map(sq => sq.User ? sq.User.name : 'Unknown Student'))];

            // Count questions by type
            const QuestionTypeCounts = datadata.reduce((acc, question) => {
                const type = question.Type || 'Unknown';
                if (type === "Number of Medium Questions (2 Mark)") {
                    acc['2 Marks'] = (acc['2 Marks'] || 0) + 2;
                }
                if (type === "Number of Easy Questions (1 Mark)") {
                    acc['1 Marks'] = (acc['1 Marks'] || 0) + 1;
                }
                if (type === "Number of Hard Questions (4 Mark)") {
                    acc['4 Mark'] = (acc['4 Mark'] || 0) + 4;
                }
                acc['StudentTotalMark'] = (acc['2 Marks'] || 0) + (acc['1 Marks'] || 0) + (acc['4 Mark'] || 0);
                return acc;
            }, {});

            // Calculate total marks for the quiz
            const totalMarks = QuestionTypeCounts['StudentTotalMark'] || 0;

            // Calculate marks for correct answers
            const CorrectAnswers = studentQuizes.filter(sq => sq.Correct).length;
            const obtainedMarks = studentQuizes.filter(sq => sq.Correct).reduce((acc, sq) => {
                const question = datadata.find(q => q.id === sq.QuestionId);
                if (question) {
                    const type = question.Type;
                    if (type === "Number of Medium Questions (2 Mark)") {
                        acc += 2;
                    }
                    if (type === "Number of Easy Questions (1 Mark)") {
                        acc += 1;
                    }
                    if (type === "Number of Hard Questions (4 Mark)") {
                        acc += 4;
                    }
                }
                return acc;
            }, 0);

            // Calculate result marks and percentage
            const ResultMarks = obtainedMarks;
            const Percentage = totalMarks > 0 ? ((obtainedMarks / TotalQuizeMarks) * 100).toFixed(2) : 0;
            const PassStatus = Percentage >= 23 ? 'Pass' : 'Fail';
            let Grads
            if (Percentage >= 28 && Percentage < 30) {
                Grads = "A";
            } else if (Percentage === 30) {
                Grads = "A+";
            } else if (Percentage >= 25 && Percentage < 28) {
                Grads = "B+";
            } else if (Percentage >= 20 && Percentage < 25) {
                Grads = "B";
            } else if (Percentage >= 16 && Percentage < 20) {
                Grads = "C+";
            } else {
                Grads = "-----";
            }


            quizReports.push({
                quizId,
                QuizName,
                Class,
                StudentNames,
                TotalQuizeMarks,
                TotalQuestions,
                AttemptedQuestions: studentQuizes.filter(sq => sq.QuestionId).length,
                CorrectAnswers,
                ResultMarks,
                Percentage,
                PassStatus,
                QuestionTypeCounts,
                Grads
            });
        }

        await transaction.commit();
        return res.status(200).json({
            reportscard: quizReports,
            success: true,
            message: "Get All Quizzes Data Success"
        });

    } catch (error) {
        console.log(error);
        if (transaction) await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "Get All Quizzes Data Failed"
        });
    }
};

exports.update = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        req.body.userId = req.profile.id;
        const questions = await Questions.update(req.body, { where: { id: req.params.questionId }, transaction });
        await transaction.commit();
        res.status(200).json({
            questions: questions,
            success: true,
            message: "Update Successfully Questions"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Questions"
        });
    }

}

exports.delete = async (req, res) => {
    let transaction = await sequelize.transaction();
    try {
        const questions = await Questions.destroy({ where: { id: req.params.questionId }, transaction });
        await transaction.commit();
        res.status(200).json({
            questions: questions,
            success: true,
            message: "Delete Successfully Questions"
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({
            error: error,
            success: false,
            message: 'Questions not found'
        });
    }
}

