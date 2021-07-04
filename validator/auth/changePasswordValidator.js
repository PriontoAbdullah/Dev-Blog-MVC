const { body } = require('express-validator');

module.exports = [
	body('oldPassword').not().isEmpty().withMessage('This field Can not be Empty'),
	body('newPassword').not().isEmpty().withMessage('This Field Can not be Empty'),
	body('confirmPassword').not().isEmpty().withMessage('This Field Can Not be Empty')
];
