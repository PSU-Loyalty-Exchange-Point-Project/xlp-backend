const express = require('express');
const router = express.Router();

const giftCardController = require('../controllers/giftCard.controller');

router.post('/create', giftCardController.postCreateGiftCard);        
router.post('/redeem', giftCardController.postRedeemGiftCard);        


module.exports = router;