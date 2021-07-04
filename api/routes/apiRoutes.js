const router = require('express').Router();
const { isAuthenticated } = require('../../middleware/authMiddleware');
const { bookmarksGetController } = require('../controller/bookmarkController');
const { commentPostController, replyCommentPostController } = require('../controller/commentController');
const { likesGetController, dislikesGetController } = require('../controller/likeDislikeController');

router.post('/comments/:postId', isAuthenticated, commentPostController);

router.post('/comments/replies/:commentId', isAuthenticated, replyCommentPostController);

router.get('/likes/:postId', isAuthenticated, likesGetController);
router.get('/dislikes/:postId', isAuthenticated, dislikesGetController);

router.get('/bookmarks/:postId', isAuthenticated, bookmarksGetController);

module.exports = router;
