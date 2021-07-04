const Flash = require('../utils/Flash');
const Post = require('../models/Post');
const Profile = require('../models/Profile');
const moment = require('moment');

function getDate(days) {
	let date = moment().subtract(days, 'days');
	return date.toDate();
}

function generateFilterObject(filter) {
	let filterObj = {};
	let order = 1;

	switch (filter) {
		case 'week': {
			filterObj = {
				createdAt: {
					$gt: getDate(7)
				}
			};
			order = -1;
			break;
		}
		case 'month': {
			filterObj = {
				createdAt: {
					$gt: getDate(30)
				}
			};
			order = -1;
			break;
		}
		case 'all': {
			order = -1;
			break;
		}
		default: {
			order = 1;
		}
	}

	return {
		filterObj,
		order
	};
}

exports.explorerGetController = async (req, res, next) => {
	let filter = req.query.filter || 'latest';
	let currentPage = parseInt(req.query.page) || 1;
	let itemPerPage = 5;

	let { filterObj, order } = generateFilterObject(filter.toLowerCase());

	try {
		let posts = await Post.find(filterObj)
			.populate('author', 'username')
			.sort(order === 1 ? '-createdAt' : 'createdAt')
			.skip(itemPerPage * currentPage - itemPerPage)
			.limit(itemPerPage);

		let totalPost = await Post.countDocuments();
		let totalPage = totalPost / itemPerPage;

		let bookmarks = [];
		if (req.user) {
			let profile = await Profile.findOne({ user: req.user._id });
			if (profile) {
				bookmarks = profile.bookmarks;
			}
		}

		res.render('pages/explorer/explorer', {
			title: 'Explore All Posts',
			filter,
			flashMessage: Flash.getMessage(req),
			posts,
			itemPerPage,
			currentPage,
			totalPage,
			bookmarks
		});
	} catch (err) {
		next(err);
	}
};

exports.singlePostGetController = async (req, res, next) => {
	let { postId } = req.params;

	try {
		let post = await Post.findById(postId)
			.populate('author', 'username profilePics')
			.populate({
				path: 'comments',
				populate: {
					path: 'user',
					select: 'username profilePics'
				}
			})
			.populate({
				path: 'comments',
				populate: {
					path: 'replies.user',
					select: 'username profilePics'
				}
			});

		if (!post) {
			let error = new Error('404 Page Not Found');
			error.status = 404;
			throw error;
		}

		let bookmarks = [];

		if (req.user) {
			let profile = await Profile.findOne({ user: req.user._id });
			if (profile) {
				bookmarks = profile.bookmarks;
			}
		}

		res.render('pages/explorer/singlePage', {
			title: post.title,
			flashMessage: Flash.getMessage(req),
			post,
			bookmarks
		});
	} catch (err) {
		next(err);
	}
};
