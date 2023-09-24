/*created by khalid
219110469
*/
const express = require('express');

const router = express.Router();
const accountController = require('../controllers/accountController');


// Define the routes for the account resource
router.get('/login', accountController.getLogin);           // Get the login page
router.post('/login', accountController.postLogin);         // Post the login credentials

router.get('/logout', accountController.getLogout);         // Get the logout page

router.get('/register', accountController.getRegister);     // Get the register page
router.post('/register', accountController.postRegister);   // Post the register details

router.get('/profile', accountController.getProfile);       // Get the profile page
router.post('/profile', accountController.postProfile);     // Post the profile updates


module.exports = router;