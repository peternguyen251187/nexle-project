const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const checkEmail = require('../middlewares/checkEmail');
const { signup: signupValidator, signin: signinValidator, refreshtoken: refreshtokenValidator } = require('../validators/auth');
const authController = require('../controllers/auth.controller');


router.route('/sign-up')
    .post(signupValidator, asyncHandler(checkEmail), asyncHandler(authController.signup));

router.route('/sign-in')
    .post(signinValidator, asyncHandler(authController.signin));

router.route('/sign-out')
    .post(asyncHandler(authController.signout));

router.route('/refresh-token')
    .post(refreshtokenValidator, asyncHandler(authController.refreshtoken));

module.exports = router;