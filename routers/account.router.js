const express = require('express');
const router = express.Router();

const accountController = require('../controllers/account.controller');
const OTPController = require('../controllers/otp.controller');

router.post('/register', accountController.postRegister);

router.get('/verify-otp/:uid', OTPController.getVerifyOTP);

router.post('/verify-otp/:uid', OTPController.postVerifyOTP);

router.get('/activate/:uid/:token', accountController.getActivateAccount);

router.post('/login', accountController.postLogin);

router.post('/logout', accountController.postLogout);

router.post('/check-authorization', accountController.postIsAuthorized);

router.post('/change-password', accountController.postChangePassword);

module.exports = router;