const { body } = require('express-validator')
const validator = require('validator')

const linkValidator = value => {
    if (value) {
        if (!validator.isURL(value)) {
            throw new Error('Please Provide Valid URL')
        }
        
    }
    return true
}

module.exports = [
    body('name')
        .not().isEmpty().withMessage('Name Can Not Be Empty')
        .isLength({ max: 50 }).withMessage('Name Can Not Be More Than 50 Charecture')
        .trim()
    ,

    body('title')
        .not().isEmpty().withMessage('Title Can Not Be Empty')
        .isLength({ max: 100 }).withMessage('Title Can Not Be more than 100 Charecture')
        .trim(),

    body('bio')
        .not().isEmpty().withMessage('Bio Can Not Be Empty')
        .isLength({ max: 500 }).withMessage('Bio Can Not br More Than 500 Charecture')
        .trim(),

    body('website')
        .custom(linkValidator),

    body('facebook')
        .custom(linkValidator),

    body('twitter')
        .custom(linkValidator),

    body('github')
        .custom(linkValidator),


]

