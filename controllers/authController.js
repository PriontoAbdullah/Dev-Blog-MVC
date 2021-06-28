const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const validationErrorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

exports.signupGetController = (req, res, next) => {
	res.render('pages/auth/signup', {
		title: 'Create a new Account',
		errors: {},
		values: {},
		flashMessage: Flash.getMessage(req)
	});
};

exports.signupPostController = async (req, res, next) => {
	let { username, email, password, confirmPassword } = req.body;

	let errors = validationResult(req).formatWith(validationErrorFormatter);

	if (!errors.isEmpty()) {
		req.flash('fail', 'Please Check Your Form');
		return res.render('pages/auth/signup', {
			title: 'Create a new Account',
			errors: errors.mapped(),
			values: {
				username,
				email,
				password
			},
			flashMessage: Flash.getMessage(req)
		});
	}

	try {
		let hashedPassword = await bcrypt.hash(password, 10);
		let user = new User({ username, email, password: hashedPassword });

		await user.save();
		req.flash('success', 'User created successfully');
		res.redirect('/auth/login');
	} catch (err) {
		console.log(err);
		next(err);
	}
};

exports.loginGetController = (req, res, next) => {
	res.render('pages/auth/login', {
		title: 'Login to Your Account',
		errors: {},
		values: {},
		flashMessage: Flash.getMessage(req)
	});
};

exports.loginPostController = async (req, res, next) => {
	let { email, password } = req.body;

	let errors = validationResult(req).formatWith(validationErrorFormatter);

	if (!errors.isEmpty()) {
		req.flash('fail', 'Please Check Your Form');
		return res.render('pages/auth/login', {
			title: 'Login to Your Account',
			errors: errors.mapped(),
			values: {
				email,
				password
			},
			flashMessage: Flash.getMessage(req)
		});
	}

	try {
		let user = await User.findOne({ email });

		if (!user) {
			req.flash('fail', 'Please Provide Valid Credentials');
			return res.render('pages/auth/login', {
				title: 'Login to Your Account',
				errors: {},
				values: {
					email,
					password
				},
				flashMessage: Flash.getMessage(req)
			});
		}

		let match = await bcrypt.compare(password, user.password);
		if (!match) {
			req.flash('fail', 'Please Provide Valid Credentials');
			return res.render('pages/auth/login', {
				title: 'Login to Your Account',
				errors: {},
				values: {
					email,
					password
				},
				flashMessage: Flash.getMessage(req)
			});
		}

		req.session.isLoggedIn = true;
		req.session.user = user;
		req.session.save((err) => {
			if (err) {
				console.log(err);
				return next(err);
			}
			req.flash('success', 'Successfully Login');
			res.redirect('/dashboard');
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
};

exports.logoutController = (req, res, next) => {
	req.session.destroy((err) => {
		if (err) {
			console.log(err);
			return next(err);
		}
		return res.redirect('/auth/login');
	});
};
