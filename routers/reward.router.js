const express = require('express');
const router = express.Router();

const rewardController = require('../controllers/reward.controller');

router.post('/create/gift-card', rewardController.postCreateGiftCardReward);
router.post('/create/discount-code', rewardController.postCreateDiscountCodeReward);

router.get('/list', rewardController.getRewardsList);
router.get('/:rewardId', rewardController.getRewardDetails);

router.post('/:rewardId', rewardController.postRedeemReward);
// router.post('/redeem/gift-card', rewardController.postRedeemGiftCardReward);
// router.post('/redeem/discount-code', rewardController.postRedeemDiscountCodeReward);


module.exports = router;