const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/all', userController.getAllUsers);

router.get('/register', userController.getCreateUser);
router.post('/register', userController.postCreateUser);

module.exports = router;