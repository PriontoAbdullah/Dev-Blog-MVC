const { render } = require('ejs');
const Flash = require('../utils/Flash');

exports.createPostGetController = (req, res, next) => {
	res.render('pages/post/createPost', {
		title: 'Create A New Post',
		error: {},
		flashMessage: Flash.getMessage(req),
		value: {}
	});
};
