let { Career } = require('../models')
const { body } = require('express-validator');

exports.userValidator = (req, res) => {
    return [
        // -------------------------email-------------------------------------------
        body('email',
            {
                error: 'Email Is Required',
                developerError: 'Email Column Should Not Be Empty'
            }).notEmpty().isEmail(),

        body('email').custom(async (value, { req }) => {
            console.log(!value)
            if (!value) {
                return Promise.reject({
                    error: 'Email Is Required',
                    developerError: 'Email Column Should Not Be Empty'
                });
            }
        }),

        // -------------------------password-------------------------------------------
        body('password',
            {
                error: 'Password Is Required',
                developerError: 'Password Should Not Be Empty'
            }).notEmpty(),


        body('password',
            {
                error: 'Password Is Required',
                developerError: 'Password Should Not Be Empty'
            }).notEmpty().isStrongPassword("1234AaBbCcDd", {
                minLength: 8,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 0,
            }),

        body('password').custom(async (value, { req }) => {
            if (!value) {
                return Promise.reject({
                    error: 'Password Is Required',
                    developerError: 'Password Should Not Be Empty'
                });
            }
        }),




        body('name',
            {
                error: 'Name Is Required',
                developerError: 'Name Should Not Be Empty'
            }).notEmpty(),

        body('name').custom(async (value, { req }) => {
            if (!value) {
                return Promise.reject({
                    error: 'Name Is Required',
                    developerError: 'Name Should Not Be Empty'
                });
            }
        }),


    ]
}
