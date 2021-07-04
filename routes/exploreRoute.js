const router = require('express').Router();
const { explorerGetController } = require('../controllers/explorerController');

router.get('/', explorerGetController);

module.exports = router;
