const express = require('express');
const router = express.Router();

const accountController = require('../controllers/account.controller');
const OTPController = require('../controllers/otp.controller');

router.post('/register', accountController.postRegister);

router.post('/check-otp', OTPController.postCheckOTP);         

router.get('/activate/:uid/:token', accountController.getActivateAccount);

router.post('/login', accountController.postLogin);         

router.post('/logout', accountController.postLogout);         

router.post('/check-authorization', accountController.isAuthorized);         

// router.get('/profile', accountController.getProfile);      
// router.post('/profile', accountController.postProfile);     


module.exports = router;