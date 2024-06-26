
let jwt = require("jsonwebtoken")
const secretkey = "token"
const { User ,Role,UserPermissionRoles} = require('../models')
exports.checkauth = async (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")
        const secretkey = "token"
        let decode = jwt.verify(token[1], secretkey)
        if (decode) {
            req.token = token[1]
            next();
        } else {
            return res.status(401).json({
                message: "Invalid or expire token provided",
                succes: false
            })
        }
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expire token provided",
            succes: false,
            error: error
        })
    }
}


// Middleware to verify JWT token
exports.getLogedInUser = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    jwt.verify(token.split(' ')[1], secretkey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.profile = decoded;
        next();
    });


}


// authMiddleware.js
/* exports.checkReadPermission = async (req, res, next) => {
    // Check if the user has read permission
    const userId = req.profile.id;
    try {
        const user = await User.findOne({
            where: { id: userId },
            include: [{ model: Role }]
           });
        res.json(user); 
        console.log(req)
        if (req.rawHeaders[0].modelName) {
            return next(); // Continue to the next middleware or route handler
        } else {
            return res.status(403).json({ message: 'Unauthorized: Read permission required.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

   
};
 */
exports.checkWritePermission = (req, res, next) => {
    // Check if the user has write permission
    if (req.user.permissions.includes('write')) {
        return next();
    }
    return res.status(403).json({ message: 'Unauthorized: Write permission required.' });
};




