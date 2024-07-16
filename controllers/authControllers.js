const { User,Role ,Teacher,Student,Address,sequelize,Countries,Staties,Cities} = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const secretkey = "token"
const session = require('express-session');

exports.login = async (req, res) => {
	//console.log(req);
    try {

        const password = req.body.password;
        const username = req.body.email

        const users = await User.findOne({ where: { email: username }, include: [{ model: Role },{ model: Teacher },{ model: Student }] })

	  if (!users) {
            return res.status(400).json({
                success: false,
                message: "Invaild Email"
            })
        }
        const ItSame = await bcrypt.compare(password, users.password)
        if (!ItSame) {
            return res.status(400).json({
                success: false,
                message: "Invaild Password"
            })
        }
        const token = jwt.sign({ id: users.id }, secretkey, { expiresIn: "24h" })
        users.createdAt = null
        users.password = null
        users.updatedAt = null



        return res.status(200).json({
            users: users,
            token: token,
            success: true,
            message: "Login SuccessFully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: error,
            success: false,
            message: "Authoration error"
        })
    }

}
exports.signout = (req, res) => {
    res.cookie("token", '', { expiresIn: "1h" });
    req.session.destroy((err) => {
        if (err) {
            console.error('Failed to destroy session:', err);
            return res.status(500).json({ success: false, message: 'Failed to logout' });
        }
        res.clearCookie('token'); // Clear session cookie
        res.status(200).json({ success: true, message: 'Logout successful' });
    });
}
exports.signup = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        let password = req.body.password;
        let roleWiseUsers
        let departmentRoleName = await Role.findOne({ where: { id: req.body.departmentId } })
        if (departmentRoleName.Name == 'Admin' || departmentRoleName.Name == 'Instructor' || departmentRoleName.Name == 'Student' || departmentRoleName.Name == 'Guest/Viewer' || departmentRoleName.Name == 'Sale Department' || departmentRoleName.Name == 'Telecaller Department' || departmentRoleName.Name == 'Front Desk' || departmentRoleName.Name == 'Receptions Desk' || departmentRoleName.Name == 'Counselor Department' || departmentRoleName.Name == 'Account Department') {
            roleWiseUsers = 'Admin';
        } else if (departmentRoleName.Name == 'Telecaller Team') {
            roleWiseUsers = 'Sub Admin';
        }

        let data = {
            name: req.body.name,
            userName: req.body.userName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            password: await bcrypt.hash(password, 10),
            departmentId: req.body.departmentId,
            roleName: roleWiseUsers,
            assignToUsers: 1,
            image: req.file? req.file.filename :null,
            src:  req.file? req.file.path :null,
            active: req.body.active
        }                                                                                                                                            
        let users = await User.create(data,{transaction})

        if(users.departmentId == 3){
            const teacherData = {
                Name:users.name,
                Email:users.email,
                Password: users.password,
                TeacherType:"Online",
                Username:users.userName,
                PhoneNumber:users.phoneNumber,
                roleId: users.id,  
            };
            const teacher = await Teacher.create(teacherData,{transaction});
            await User.update({ teacherId: teacher.id }, { where: { id: users.id }, transaction });
        }
        if(users.departmentId == 4){
            const studentData= {
                Name:users.name,
                Email:users.email,
                Password: users.password,
                Username:users.userName,
                PhoneNumber:users.phoneNumber,
                roleId:users.id, 
            };
           const students = await Student.create(studentData,{transaction});
            await User.update({ studentId: students.id }, { where: { id: users.id }, transaction });
        }
      
        
        await transaction.commit();
        users.createdAt = null
        users.password = null
        users.updatedAt = null
        return res.status(200).json({
            users: users,
            success: true,
            message: "Users Created SuccessFully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: error,
            success: false,
            message: "Users error"
        })
    }

}

exports.findOne = async (req, res) => {
    const transaction = await sequelize.transaction();
    let Teachers;
    let Students;

    try {
        // Fetch the user with included related models
        const user = await User.findOne({
            where: { id: req.params.usersId },
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
                "createdAt",
            ],
            include: [{ model: Role }, { model: Address }],
            transaction
        });

        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch related student and teacher records
        if (user.studentId) {
            Students = await Student.findOne({
                where: { id: user.studentId },
                transaction
            });
        }

        if (user.teacherId) {
            Teachers = await Teacher.findOne({
                where: { id: user.teacherId },
                transaction
            });
        }

        // Add related records to the user object if they exist
        if (Teachers) {
            user.dataValues.Teachers = [Teachers];
        }
        if (Students) {
            user.dataValues.Students = [Students];
        }

        await transaction.commit();

        res.status(200).json({
            users:user ,
            success: true,
            message: "Fetched user by ID successfully"
        });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({
            error: error,
            success: false,
            message: "Error in fetching the user"
        });
    }
}

exports.update = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      let roleWiseUsers;
      const existingUser = await User.findOne({ where: { id: req.params.usersId }, transaction });
      if (!existingUser) {
        return res.status(404).json({ message: 'Existing profile not found' });
      }
  
      const departmentRole = await Role.findOne({ where: { id: req.body.departmentId }, transaction });
      if (!departmentRole) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Department role not found' });
      }
  
      if (['Admin', 'Instructor', 'Student', 'Guest/Viewer', 'Sale Department', 'Telecaller Department', 'Front Desk', 'Receptions Desk', 'Counselor Department', 'Account Department'].includes(departmentRole.Name)) {
        roleWiseUsers = 'Admin';
      } else if (departmentRole.Name === 'Telecaller Team') {
        roleWiseUsers = 'Sub Admin';
      } else {
        roleWiseUsers = 'User';
      }
  
      const data = {
        name: req.body.name,
        userName: req.body.userName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        departmentId: req.body.departmentId,
        roleName: roleWiseUsers,
        assignToUsers: 1,
        image: req.file ? req.file.filename : existingUser.image,
        src: req.file ? req.file.path : existingUser.src,
        active: req.body.active,
      };
  
      await User.update(data, { where: { id: req.params.usersId }, transaction });
  
      let address = await Address.findOne({ where: { AddressableId: req.params.usersId }, transaction });
      if (!address) {
        req.body.AddressableId = existingUser.id;
        req.body.AddressableType = 'Users';
        address = await Address.create(req.body, { transaction });
        await User.update({ AddressableId: address.id }, { where: { id: existingUser.id }, transaction });
      } else {
        req.body.AddressableId = existingUser.id;
        req.body.AddressableType = 'Update Users';
        await Address.update(req.body, { where: { id: address.id }, transaction });
      }
  
      const updatedUser = await User.findOne({ where: { id: req.params.usersId }, transaction });
      if (!updatedUser) {
        await transaction.rollback();
        return res.status(404).json({ message: 'User not found after update' });
      }
  
      if (updatedUser.departmentId == 3) {
        const teacherData = {
          Name: updatedUser.name,
          Email: updatedUser.email,
          TeacherType: 'Online',
          Username: updatedUser.userName,
          PhoneNumber: updatedUser.phoneNumber,
          roleId: updatedUser.id,
          AddressableId: updatedUser.AddressableId,
          DOB:req.body.DOB,
          TeacherType:req.body.TeacherType,
          YourIntroducationAndSkills:req.body.YourIntroducationAndSkills,
        };
        const teacher = await Teacher.update(teacherData, { where: { id:updatedUser.teacherId }, order: [['updatedAt', 'DESC']], transaction });
        await User.update({ teacherId: teacher.id }, { where: { id: updatedUser.id }, transaction });
      }
  
      if (updatedUser.departmentId == 4) {
        const studentData = {
          Name: updatedUser.name,
          Email: updatedUser.email,
          Password: updatedUser.password,
          Username: updatedUser.userName,
          PhoneNumber: updatedUser.phoneNumber,
          roleId: updatedUser.id,
          AddressableId: updatedUser.AddressableId,
          CoursesId:req.body.CoursesId,
          Date:req.body.Date,
          BatchId:req.body.BatchId,
        };
        const student = await Student.update(studentData, { where: { id:updatedUser.studentId }, order: [['updatedAt', 'DESC']], transaction });
        await User.update({ studentId: student.id }, { where: { id: updatedUser.id }, transaction });
      }
  
      await transaction.commit();
      res.status(200).json({
        users: updatedUser,
        success: true,
        message: 'Update successful',
      });
    } catch (error) {
      console.error('Error while updating user:', error);
      await transaction.rollback();
      res.status(500).json({
        error: error,
        success: false,
        message: 'Error while updating the user',
      });
    }
  };
  
exports.forgotPassword = async (req, res) => {
    try {
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                console.log(err);
            }
            let token = buffer.toString("hex")
            User.findOne({
                where: {
                    [Op.or]: [
                        { username: req.body.username }
                    ]
                }
            }).then(users => {
                if (!users) {
                    return res.status(404).json({
                        success: false,
                        message: "Invalid Username Please try With Valid UserName"

                    });

                }

                else {

                    var otp = Math.floor((Math.random() * 1000000) + 1)
                    users.expireToken = Date.now() + 360000
                    users.resentPassword = token;
                    users.passwordResetOtp = otp
                    users.save().then((result) => {
                        ejs.renderFile(path.join(__dirname, "../views/index.ejs"),
                            {
                                username: users.username,
                                token: otp,
                                url: process.env.FRONTEND_BASE_URL

                            }).then(emailTemplate => {
                                transporter.sendMail({
                                    to: users.username,
                                    from: "kolonizer",
                                    subject: "Password Reset",
                                    html: emailTemplate
                                })
                            })

                        res.status(200).json({
                            success: true,
                            message: "Successfully send reset-password-link mail",
                            Newtoken: token
                        })
                    })



                }
            })
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to reset Password.",
            error: error
        })
    }
}
exports.verfiyOtp = async (req, res) => {
    const sentToken = req.body.otp
    const sentToken2 = req.body.token
    resentPassword.findOne({
        where: {
            [Op.or]: [
                { passwordResetOtp: sentToken },
                { resentPassword: sentToken2 }
            ]
        }
    }).then(users => {
        if (!users) {
            return res.status(404).json({
                success: false,
                message: "Invalid Otp Please try With Valid Otp"

            });
        }
        return res.status(200).json({
            success: true,
            message: "Successfully Verfied Otp"
        })

    }).catch(err => {
        console.log(err);
    })
}
exports.newPassword = async (req, res) => {
    try {
        const newPassword = req.body.password
        const Confirm = req.body.confirm
        const resentPassword = req.body.token
        if (newPassword != Confirm) {
            return res.status(404).json({
                message: "Invalid Confirm password Please try With Valid Confirm password"

            })
        }

        const Users = await User.findOne({ where: { resentPassword: resentPassword } })

        if (Users) {
            const salt = bcrypt.genSaltSync(10, 'a');
            Users.password = bcrypt.hashSync(newPassword, salt);
            Users.save().then((saveduser) => {
                res.json({
                    message: "Password Updated success",
                    Users: Users
                })
            })
        }

    }
    catch (error) {
        return res.status(500).json({
            message: "Invalid Otp"

        })
    }
}
exports.userWisedata = async (req, res) => {
    const userId = req.profile.id;
    try {
        const user = await User.findOne({ 
            where: { id: userId },
            include: [{ model: Role }] 
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.country  = async (req, res) => {
    try {
        let country = await Countries.findAll({ include: [{ model: Staties, include: [{ model: Cities }] }] });
        res.status(200).json({
            country: country,
            success: true,
            message: "Get All Data Success"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error,
            success: false,
            message: "Failed to retrieve data"
        });
    }
};

