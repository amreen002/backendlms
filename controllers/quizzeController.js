
const { Quize, Role, User, Categories, Teacher, Batch, sequelize } = require('../models')

exports.create = async (req, res) => {
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

        const quizze = await Quize.create(req.body);
        return res.status(200).json({
            quizze: quizze,
            success: true,
            message: "Quiz Created Successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message,
            success: false,
            message: "Quiz creation error"
        });
    }
}

exports.findOne = async (req, res) => {
    try {
        const quizze = await Quize.findOne({ where: { id: req.params.quizzeId }, include: [{ model: User, include: [{ model: Role }] }, { model: Categories }, { model: Batch }] });
        res.status(200).json({
            quizze: quizze,
            success: true,
            message: "get one Quizze by ID"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Quizze'
        });
    }
}

exports.findAll = async (req, res) => {
    try {
        const quizze = await Quize.findAll({
            include: [
                { model: User, include: [{ model: Role }] },
                { model: Categories },
                { model: Batch }
            ]
        });
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

        return res.status(200).json({
            quizze: quizze,
            success: true,
            message: "Get All Quizze Data Success"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error,
            success: false,
            message: "Get All Quizze Data Failed"
        });
    }
}

exports.update = async (req, res) => {
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
        const quizze = await Quize.update(req.body, { where: { id: req.params.quizzeId } });
        res.status(200).json({
            quizze: quizze,
            success: true,
            message: "Update Successfully Quizze"
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Quizze"
        });
    }

}

exports.delete = async (req, res) => {
    try {
        const quizze = await Quize.destroy({ where: { id: req.params.quizzeId } });
        res.status(200).json({
            quizze: quizze,
            success: true,
            message: "Delete Successfully Quizze"
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            success: false,
            message: 'Quizze not found'
        });
    }
}

