const router = require('express').Router();
const {
	signupGetController,
	signupPostController,
	loginGetController,
	loginPostController,
	logoutController,
	changePasswordGetController,
	changePasswordPostController
} = require('../controllers/authController');
const { isUnAuthenticated, isAuthenticated } = require('../middleware/authMiddleware');
const loginValidator = require('../validator/auth/loginValidator');

const singupValidator = require('../validator/auth/signupValidator');
const changePaswordValidator = require('../validator/auth/changePasswordValidator');

//SignUp Routes
router.get('/signup', isUnAuthenticated, signupGetController);
router.post('/signup', singupValidator, isUnAuthenticated, signupPostController);

//Login Routes
router.get('/login', isUnAuthenticated, loginGetController);
router.post('/login', loginValidator, isUnAuthenticated, loginPostController);

//change passworod
router.get('/change-password', isAuthenticated, changePasswordGetController);
router.post('/change-password', isAuthenticated, changePaswordValidator, changePasswordPostController);

//Logout Routes
router.get('/logout', logoutController);

module.exports = router;
