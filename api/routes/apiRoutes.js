const router = require('express').Router();
const { isAuthenticated } = require('../../middleware/authMiddleware');
const { commentPostController, replayCommentPostController } = require('../controller/commentController');
const { likesGetController, dislikesGetController } = require('../controller/likeDislikeController');
const { bookmarksGetController } = require('../controller/bookmarkController');

router.post('/comments/:postId', isAuthenticated, commentPostController);
router.post('/comments/replies/:commentId', isAuthenticated, replayCommentPostController);

router.get('/likes/:postId', isAuthenticated, likesGetController);
router.get('/dislikes/:postId', isAuthenticated, dislikesGetController);

router.get('/bookmarks/:postId', isAuthenticated, bookmarksGetController);

module.exports = router;
