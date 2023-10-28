const express = require('express');
const router = express.Router();

const walletController = require('../controllers/transaction.controller');
    
router.get('/recent-transactions', walletController.getRecentTransactions);      
// router.post('/profile', accountController.postProfile);     


module.exports = router;