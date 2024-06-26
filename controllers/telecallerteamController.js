
const { TelecallerDepartment, SaleTeam,Role ,User} = require('../models')
exports.create = async (req, res) => {
    try {
      
        const telecallerdepartment = await TelecallerDepartment.create(req.body)

        return res.status(200).json({
            telecallerdepartment: telecallerdepartment,
            success: true,
            message: "Telecaller Team Created SuccessFully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: error,
            success: false,
            message: "Telecaller Team  error"
        })
    }

}

exports.findOne = async (req, res) => {
    try {
        const telecallerdepartment = await TelecallerDepartment.findOne({ where: { id: req.params.telecallerteamId },include: [{ model: User }] });
        res.status(200).json({
            telecallerdepartment: telecallerdepartment,
            success: true,
            message: "get one Telecaller Team by ID"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: 'error in getting the Telecaller Team'
        });
    }
}

exports.findAll = async (req, res) => {
    try {
        let where={}
        let telecallerdepartment = await TelecallerDepartment.findAll({where,include: [{ model: User,include: [{ model: Role }] }]});
        res.status(200).json({
            telecallerdepartment: telecallerdepartment,
            success: true,
            message: "Get All Telecaller Team Data Success"
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: error,
            success: false,
            message: "Get Not All  Telecaller Team Data Success"
        });
    }
}

exports.update = async (req, res) => {
    try {
        const telecallerdepartment = await TelecallerDepartment.update(req.body, { where: { id: req.params.telecallerteamId } });
        res.status(200).json({
            telecallerdepartment: telecallerdepartment,
            success: true,
            message: "Update Successfully Telecaller Team "
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            success: false,
            message: "error  While Update The Telecaller Team "
        });
    }

}

exports.delete = async (req, res) => {
    try {
        const telecallerdepartment = await TelecallerDepartment.destroy({ where: { id: req.params.telecallerteamId } });
        res.status(200).json({
            telecallerdepartment: telecallerdepartment,
            success: true,
            message: "Delete Successfully Telecaller Department"
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            success: false,
            message: 'Telecaller Department not found'
        });
    }
}


exports.TeamFindAll = async (req, res) => {
    try {
        const roleId = req.profile.id;
        const department = await SaleTeam.findOne({ where: { roleId: roleId }, include: [{ model: User,include: [{ model: Role }]  }] });
        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Telecaller Department not found"
            });
        } 
        const usertelecallerteam = await SaleTeam.findAll({ 
            where: { roleId: department.roleId, telecallerPersonName: "Allotted" }, include: [{ model: User ,include: [{ model: Role }]}]
        });

        res.status(200).json({
            usertelecallerteam: usertelecallerteam,
            success: true,
            message: "Retrieved all Telecaller Department successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to retrieve data"
        });
    }
};