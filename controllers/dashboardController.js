const Flash = require('../utils/Flash');
const Profile = require('../models/Profile');
const errorFormatter = require('../utils/validationErrorFormatter');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Comment = require('../models/Comment');

exports.dashboardGetController = async (req, res, next) => {
	try {
		let profile = await Profile.findOne({ user: req.user._id })
			.populate({
				path: 'posts',
				select: 'title thumbnail'
			})
			.populate({
				path: 'bookmarks',
				select: 'title thumbnail'
			});
		if (profile) {
			return res.render('pages/dashboard/dashboard', {
				title: 'My Dashboard',
				error: {},
				flashMessage: Flash.getMessage(req),
				posts: profile.posts.reverse().slice(0, 4),
				bookmarks: profile.bookmarks.reverse().slice(0, 4)
			});
		}

		res.redirect('/dashboard/create-profile');
	} catch (e) {
		next(e);
	}
};

exports.createProfileGetController = async (req, res, next) => {
	try {
		let profile = await Profile.findOne({ user: req.user._id });
		if (profile) {
			return res.redirect('/dashboard/edit-profile');
		}

		res.render('pages/dashboard/create-profile', {
			title: 'Create Your Profile',
			flashMessage: Flash.getMessage(req),
			error: {}
		});
	} catch (e) {
		next(e);
	}
};

exports.createProfilePostController = async (req, res, next) => {
	let errors = validationResult(req).formatWith(errorFormatter);

	if (!errors.isEmpty()) {
		return res.render('pages/dashboard/create-profile', {
			title: 'Create Your Profile',
			flashMessage: Flash.getMessage(req),
			error: errors.mapped()
		});
	}
	let { name, title, bio, website, facebook, twitter, github } = req.body;

	let profilePics = req.user.profilePics;
	let posts = [];
	let bookmark = [];

	try {
		let profile = new Profile({
			user: req.user._id,
			name,
			title,
			bio,
			profilePics,
			links: {
				website: website || '',
				facebook: facebook || '',
				twitter: twitter || '',
				github: github || ''
			},
			posts,
			bookmark
		});

		let createdProfile = await profile.save();
		await User.findOneAndUpdate(
			{ _id: req.user._id },
			{
				$set: {
					profile: createdProfile._id
				}
			}
		);
		req.flash('success', 'Profile Created Successfully');
		res.redirect('/dashboard');
	} catch (e) {
		next(e);
	}
};

exports.editProfileGetController = async (req, res, next) => {
	try {
		let profile = await Profile.findOne({ user: req.user._id });
		if (!profile) {
			return res.redirect('/dashboard/create-profile');
		}

		res.render('pages/dashboard/edit-profile', {
			title: 'Edit Your Profile',
			error: {},
			flashMessage: Flash.getMessage(req),
			profile
		});
	} catch (e) {
		next(e);
	}
};
exports.editProfilePostController = async (req, res, next) => {
	let errors = validationResult(req).formatWith(errorFormatter);

	let { name, title, bio, website, facebook, twitter, github } = req.body;

	if (!errors.isEmpty()) {
		return res.render('pages/dashboard/create-profile', {
			title: 'Create Your Profile',
			flashMessage: Flash.getMessage(req),
			error: errors.mapped(),
			profile: {
				name,
				title,
				bio,
				links: {
					website,
					facebook,
					twitter,
					github
				}
			}
		});
	}

	try {
		let profile = {
			name,
			title,
			bio,
			links: {
				website: website || '',
				facebook: facebook || '',
				twitter: twitter || '',
				github: github || ''
			}
		};

		let updateProfile = await Profile.findOneAndUpdate({ user: req.user._id }, { $set: profile }, { new: true });

		req.flash('success', 'Profile Updated Successfully');

		res.render('pages/dashboard/edit-profile', {
			title: 'Edit Your Profile',
			error: {},
			flashMessage: Flash.getMessage(req),
			profile: updateProfile
		});

		// res.redirect('/dashboard')
	} catch (e) {
		next(e);
	}
};

exports.bookmarksGetController = async (req, res, next) => {
	try {
		let profile = await Profile.findOne({ user: req.user._id }).populate({
			path: 'bookmarks',
			model: 'Post',
			select: 'title thumbnail'
		});
		res.render('pages/dashboard/bookmarks', {
			title: 'My Bookmarks',
			flashMessage: Flash.getMessage(req),
			posts: profile.bookmarks
		});
		
	} catch (e) {
		next(e);
	}
};

exports.commentsGetController = async (req, res, next) => {
	try {
		let profile = await Profile.findOne({ user: req.user._id });
		let comments = await Comment.find({ post: { $in: profile.posts } })
			.populate({
				path: 'post',
				select: 'title'
			})
			.populate({
				path: 'user',
				select: 'username profilePics'
			})
			.populate({
				path: 'replies.user',
				select: 'username profilePics'
			});

		res.render('pages/dashboard/comments', {
			title: ' My Recent Comment',
			flashMessage: Flash.getMessage(req),
			comments
		});
	} catch (e) {
		next(e);
	}
};
