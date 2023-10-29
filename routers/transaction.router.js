const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transaction.controller');
// const transactionController = require('../controllers/trabsaction.controller');
    
router.get('/recent-transactions', transactionController.getRecentTransactions);      
// router.post('/profile', accountController.postProfile);     


   
module.exports = router;