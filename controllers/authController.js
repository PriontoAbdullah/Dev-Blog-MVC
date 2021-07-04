const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const Flash = require('../utils/Flash');

// Sign Up Controller
exports.signupGetController = (req, res, next) => {
	res.render('pages/auth/signup.ejs', {
		title: 'Create Your Account',
		error: {},
		value: {},
		flashMessage: Flash.getMessage(req)
	});
};

exports.signupPostController = async (req, res, next) => {
	const { email, username, password } = req.body;
	let errors = validationResult(req).formatWith(errorFormatter);

	if (!errors.isEmpty()) {
		req.flash('fail', 'Please Check Your Form');
		return res.render('pages/auth/signup.ejs', {
			title: 'Create Your Account',
			error: errors.mapped(),
			value: { username, email, password },
			flashMessage: Flash.getMessage(req)
		});
	}

	try {
		let hashedPassword = await bcrypt.hash(password, 11);

		let user = new User({
			username,
			email,
			password: hashedPassword
		});

		await user.save();
		req.flash('success', 'User Created Successfully');
		res.redirect('/auth/login');
	} catch (e) {
		next(e);
	}
};

//Login Controller
exports.loginGetController = (req, res, next) => {
	res.render('pages/auth/login.ejs', {
		title: 'Login Your Account',
		error: {},
		flashMessage: Flash.getMessage(req)
	});
};
exports.loginPostController = async (req, res, next) => {
	let { email, password } = req.body;

	let errors = validationResult(req).formatWith(errorFormatter);

	if (!errors.isEmpty()) {
		req.flash('fail', 'Plese Check Your Form');
		return res.render('pages/auth/login.ejs', {
			title: 'Login to Your Account',
			error: errors.mapped(),
			flashMessage: Flash.getMessage(req)
		});
	}

	try {
		let user = await User.findOne({ email });

		if (!user) {
			req.flash('fail', 'Please Provide Valid Credentials');
			return res.render('pages/auth/login.ejs', {
				title: 'Login to Your Account',
				error: {},
				flashMessage: Flash.getMessage(req)
			});
		}
		let match = await bcrypt.compare(password, user.password);
		if (!match) {
			req.flash('fail', 'Please Provide Valid Credentials');
			return res.render('pages/auth/login.ejs', {
				title: 'Login to Your Account',
				error: {},
				flashMessage: Flash.getMessage(req)
			});
		} else {
			(req.session.isLoggedIn = true),
				(req.session.user = user),
				req.session.save((err) => {
					if (err) {
						console.log(err);
						return next(err);
					}
					req.flash('success', 'Successfully Logged In');
					res.redirect('/dashboard');
				});
		}
	} catch (e) {
		next(e);
	}
};

//Logout Controller
exports.logoutController = (req, res, next) => {
	req.session.destroy((err) => {
		if (err) {
			return next(err);
		}
		// req.flash('success', 'Successfully Log out');
		return res.redirect('/auth/login');
	});
};

//change Password Controller
exports.changePasswordGetController = async (req, res, next) => {
	res.render('pages/auth/changePassword', {
		title: 'Change My Password',
		flashMessage: Flash.getMessage(req),
		error: {}
	});
};

exports.changePasswordPostController = async (req, res, next) => {
	let errors = validationResult(req).formatWith(errorFormatter);

	if (!errors.isEmpty()) {
		req.flash('fail', 'Please Check Your Form');
		return res.render('pages/auth/changePassword.ejs', {
			title: 'Change My password',
			error: errors.mapped(),
			flashMessage: Flash.getMessage(req)
		});
	}
	let { oldPassword, newPassword, confirmPassword } = req.body;

	if (newPassword !== confirmPassword) {
		req.flash('fail', 'Password dose not Math');
		return res.redirect('/auth/change-password');
	}

	try {
		let match = await bcrypt.compare(oldPassword, req.user.password);
		if (!match) {
			req.flash('fail', 'Invalid Old Password');
			return res.redirect('/auth/change-password');
		}

		let hash = await bcrypt.hash(newPassword, 11);
		await User.findOneAndUpdate({ _id: req.user._id }, { $set: { password: hash } }, { new: true });

		req.flash('success', 'Password Updated Successfully');

		return res.redirect('/auth/change-password');
	} catch (e) {
		next(e);
	}
};
