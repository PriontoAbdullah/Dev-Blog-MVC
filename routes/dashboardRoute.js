const router = require('express').Router();
const {
	dashboardGetController,
	createProfileGetController,
	createProfilePostController,
	editProfileGetController,
	editProfilePostController,
	bookmarksGetController,
	commentsGetController
} = require('../controllers/dashboardController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const profileValidator = require('../validator/dashboard/profileValidator');

router.get('/bookmarks', isAuthenticated, bookmarksGetController);
router.get('/comment', isAuthenticated, commentsGetController);

router.get('/create-profile', isAuthenticated, createProfileGetController);
router.post('/create-profile', isAuthenticated, profileValidator, createProfilePostController);

router.get('/edit-profile', isAuthenticated, editProfileGetController);
router.post('/edit-profile', isAuthenticated, profileValidator, editProfilePostController);

router.get('/', isAuthenticated, dashboardGetController);

module.exports = router;
