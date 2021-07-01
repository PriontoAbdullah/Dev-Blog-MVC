const router = require('express').Router();
const { signupGetController, signupPostController, loginGetController, loginPostController, logoutController } = require('../controllers/authController');
const { isUnAuthenticated } = require('../middleware/authMiddleware');
const loginValidator = require('../validator/auth/loginValidator');



const singupValidator = require('../validator/auth/signupValidator')


//SignUp Routes
router.get('/signup',isUnAuthenticated, signupGetController);
router.post('/signup', singupValidator, isUnAuthenticated, signupPostController);

//Login Routes
router.get('/login',isUnAuthenticated, loginGetController);
router.post('/login', loginValidator ,isUnAuthenticated, loginPostController);

//Logout Routes
router.get('/logout', logoutController);

module.exports = router