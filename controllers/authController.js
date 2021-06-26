const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const validationErrorFormatter = require('../utils/validationErrorFormatter');

exports.signupGetController = (req, res, next) => {
	res.render('pages/auth/signup', { title: 'Create a new Account', errors: {}, values: {} });
};

exports.signupPostController = async (req, res, next) => {
	let { username, email, password, confirmPassword } = req.body;

	let errors = validationResult(req).formatWith(validationErrorFormatter);
	if (!errors.isEmpty()) {
		return res.render('pages/auth/signup', {
			title: 'Create a new Account',
			errors: errors.mapped(),
			values: {
				username,
				email,
				password
			}
		});
	}

	try {
		let hashedPassword = await bcrypt.hash(password, 10);
		let user = new User({ username, email, password: hashedPassword });

		let createdUser = await user.save();
		console.log('User created successfully', createdUser);
		res.render('pages/auth/signup', { title: 'Create a new Account' });
	} catch (err) {
		console.log(err);
		next(err);
	}
};

exports.loginGetController = (req, res, next) => {
	res.render('pages/auth/login', { title: 'Login to Your Account' });
};

exports.loginPostController = async (req, res, next) => {
	let { email, password } = req.body;

	try {
		let user = await User.findOne({ email });

		if (!user) {
			return res.json({ message: 'Invalid Credentials' });
		}

		let match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.json({ message: 'Invalid Credentials' });
		}

		console.log('User login successfully', user);
		res.render('pages/auth/login', { title: 'Login to Your Account' });
	} catch (err) {
		console.log(err);
		next(err);
	}
};

exports.logoutController = (req, res, next) => {};
