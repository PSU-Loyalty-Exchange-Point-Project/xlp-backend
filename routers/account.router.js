const express = require('express');
const router = express.Router();

const accountController = require('../controllers/account.controller');

router.get('/all', accountController.getAllUsers); // DELETE

// router.get('/register', accountController.getCreateUser);
router.post('/register', accountController.postRegister);

// router.get('/login', accountController.getLogin);           
router.post('/login', accountController.postLogin);         

// router.get('/logout', accountController.getLogout);         

// router.get('/profile', accountController.getProfile);      
// router.post('/profile', accountController.postProfile);     


module.exports = router;