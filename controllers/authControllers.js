const { User,Role ,Teacher,Student} = require('../models')
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
        return res.status(400).json({
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
        return res.status(404).json({
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