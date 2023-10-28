const express = require('express');
const router = express.Router();

const walletController = require('../controllers/wallet.controller');
    
router.get('/balance', walletController.getUserWallet);      
router.post('/deduct', walletController.postDeductBalance);      
router.post('/add', walletController.postAddBalance);      
// router.post('/profile', accountController.postProfile);     


module.exports = router;