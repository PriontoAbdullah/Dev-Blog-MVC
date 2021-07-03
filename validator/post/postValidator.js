const { body } = require('express-validator');
const cheerio = require('cheerio');

module.exports = [
	body('title')
		.not()
		.isEmpty()
		.withMessage('Title Can Not Be Empty')
		.isLength({ max: 100 })
		.withMessage("Title Can't be greater than 100 Chars")
		.trim(),

	body('body').not().isEmpty().withMessage("Body can't be empty").custom((value) => {
		let $node = cheerio.load(value);
		let text = $node.text();

		if (text.length > 5000) {
			throw new Error("Body Can't be Greater Than 5000 Chars");
		}
		return true;
	}),

	body('tags').not().isEmpty().withMessage('Tags Must Be Important').trim()
];
