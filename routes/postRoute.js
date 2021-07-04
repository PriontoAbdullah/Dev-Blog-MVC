const router = require('express').Router();
const postValidator = require('../validator/post/postValidator');
const { isAuthenticated } = require('../middleware/authMiddleware');
const {
	createPostGetController,
	createPostPostController,
	editPostGetController,
	editPostPostController,
	deletePostGetController,
	postsGetController
} = require('../controllers/postController');
const upload = require('../middleware/uploadMiddleware');
const { singlePostGetController } = require('../controllers/explorerController');

router.get('/create', createPostGetController);
router.post('/create', isAuthenticated, upload.single('post-thumbnail'), postValidator, createPostPostController);

router.get('/:postId', singlePostGetController);

router.get('/edit/:postId', isAuthenticated, editPostGetController);
router.post('/edit/:postId', isAuthenticated, upload.single('post-thumbnail'), postValidator, editPostPostController);

router.get('/delete/:postId', isAuthenticated, deletePostGetController);

router.get('/', isAuthenticated, postsGetController);

module.exports = router;
