const { body } = require('express-validator');
const { Courses } = require('../models');

exports.classValidator  = async (req, res, next) => {
    console.log(req.body.name)
       // await Promise.all(  console.log(req.body.name));


};
  /*       body('name').notEmpty().withMessage({error: 'Name Is Required', developerError: 'Name Should Not Be Empty' }),
        body('name').custom(async (value) => {
            console.log(value)
            const course = await Courses.findOne({ where: { name: value } });
            if (course) {
                return Promise.reject({
                    error: 'Name already in use',
                    developerError: 'A course with this name already exists'
                });
            }
        }), */
    


