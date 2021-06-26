const { body } = require('express-validator');
const User = require('../../models/User');

module.exports = [
	body('username')
		.isLength({ min: 5, max: 15 })
		.withMessage('Username must be Between 5 to 15 characters')
		.custom(async (username) => {
			let user = await User.findOne({ username });
			if (user) {
				return Promise.reject('Username already used');
			}
		})
		.trim(),

	body('email')
		.isEmail()
		.withMessage('Please Provide a valid Email')
		.custom(async (email) => {
			let user = await User.findOne({ email });
			if (user) {
				return Promise.reject('Email already used');
			}
		})
		.normalizeEmail(),

	body('password').isLength({ min: 6 }).withMessage('Your password must be at least 6 characters'),

	body('confirmPassword')
		.isLength({ min: 6 })
		.withMessage('Your password must be at least 6 characters')
		.custom((confirmPassword, { req }) => {
			if (confirmPassword !== req.body.password) {
				throw new Error('Your password does not match');
			}
			return true;
		})
];
