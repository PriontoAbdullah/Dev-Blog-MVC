const router = require('express').Router();
const { createPostGetController } = require('../controllers/postController');

router.get('/create', createPostGetController);

module.exports = router;
