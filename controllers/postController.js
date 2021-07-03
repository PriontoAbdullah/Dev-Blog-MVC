const Flash = require('../utils/Flash');
const { validationResult } = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const readingTime = require('reading-time');
const Post = require('../models/Post');
const Profile = require('../models/Profile');

exports.createPostGetController = (req, res, next) => {
	res.render('pages/post/createPost', {
		title: 'Create A New Post',
		error: {},
		flashMessage: Flash.getMessage(req),
		value: {}
	});
};

exports.createPostPostController = async (req, res, next) => {
	let { title, body, tags } = req.body;
	let errors = validationResult(req).formatWith(errorFormatter);

	if (!errors.isEmpty()) {
		return res.render('pages/post/createPost', {
			title: 'Create A New Post',
			error: errors.mapped(),
			flashMessage: Flash.getMessage(req),
			value: {
				title,
				body,
				tags
			}
		});
	}

	if (tags) {
		tags = tags.split(',');
		tags = tags.map((t) => t.trim());
	}

	let readTime = readingTime(body).text;

	let post = new Post({
		title,
		body,
		tags,
		author: req.user._id,
		thumbnail: '',
		readTime,
		likes: [],
		dislikes: [],
		comments: []
	});

	if (req.file) {
		post.thumbnail = `/uploads/${req.file.filename}`;
	}

	try {
		let createdPost = await post.save();
		await Profile.findOneAndUpdate({ user: req.user._id }, { $push: { posts: createdPost._id } });

		req.flash('success', 'Post created successfully');
		return res.redirect(`/posts/edit/${createdPost._id}`);
	} catch (err) {
		next(err);
	}
};

exports.editPostGetController = async (req, res, next) => {
	let postId = req.params.postId;

	let post = await Post.findOne({ author: req.user._id, _id: postId });

	try {
		if (!post) {
			let error = new Error('Post not found');
			error.status = 404;
			throw error;
		}

		res.render('pages/post/editPost', {
			title: `Edit Your Post: ${post.title}`,
			error: {},
			flashMessage: Flash.getMessage(req),
			post
		});
	} catch (err) {
		next(err);
	}
};

exports.editPostPostController = async (req, res, next) => {
	let { title, body, tags } = req.body;
	let postId = req.params.postId;
	let errors = validationResult(req).formatWith(errorFormatter);

	try {
		let post = await Post.findOne({ author: req.user._id, _id: postId });

		if (!post) {
			let error = new Error('404 page Not Found');
			error.status = 404;
			throw new error();
		}

		if (!errors.isEmpty) {
			return res.render('pages/post/createPost', {
				title: 'Create A New Post',
				error: errors.mapped(),
				flashMessage: Flash.getMessage(req),
				post
			});
		}
		if (tags) {
			tags = tags.split(',');
			tags = tags.map((t) => t.trim());
		}

		if (req.file) {
			post.thumbnail = `/uploads/${req.file.filename}`;
		}
		let thumbnail = post.thumbnail;

		await Post.findOneAndUpdate({ _id: post._id }, { $set: { title, body, tags, thumbnail } }, { new: true });
		req.flash('success', 'Post Updated Successfully');
		return res.redirect('/posts/edit/' + post._id);
	} catch (e) {
		next(e);
	}
};

exports.deletePostGetController = async (req, res, next) => {
	let { postId } = req.params;

	try {
		let post = await Post.findOne({ author: req.user._id, _id: postId });
		if (!post) {
			let error = new Error('404 Page Not Found');
			error.status = 404;
			throw error;
		}

		await Post.findOneAndDelete({ _id: postId });
		await Profile.findOneAndUpdate({ user: req.user._id }, { $pull: { posts: postId } });

		req.flash('success', 'Post Delete Successfully');
		res.redirect('/posts');
	} catch (e) {
		next(e);
	}
};

exports.postsGetController = async (req, res, next) => {
	try {
		let posts = await Post.find({ author: req.user._id });
		res.render('pages/post/posts', {
			title: 'My All Created Post',
			posts,
			flashMessage: Flash.getMessage(req),
			error: {}
		});
	} catch (e) {
		next(e);
	}
};
