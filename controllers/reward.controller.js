const { Partner, Reward, RewardGiftCard, RewardDiscountCode } = require('../models');
const { deductBalance } = require('./wallet.controller');

const rewardsList = async (rewardsPerPage = 9, page = 0) => {
    let rewards = await Reward.findAll({ 
        limit: rewardsPerPage,
        offset: page * rewardsPerPage
    });
    return rewards;
};

const getRewardsList = async (request, response) => {
    let rewardsPerPage = request.query.rewardsPerPage || 9;
    let page = request.query.page || 0;

    let rewards = await rewardsList(rewardsPerPage, page);

    return response.send(rewards);
}

const createGiftCardReward = async (partnerName, name, price, number) => {
    let partner = await Partner.findOne({ name: partnerName }) || await Partner.create({ name: partnerName });
    let reward = await Reward.findOne({ name: name, price: price, PartnerId: partner.id }) || await Reward.create({ name: name, price: price, PartnerId: partner.id });

    let giftCardReward = await RewardGiftCard.create({ number: number, RewardId: reward.id });

    return giftCardReward;
} 

const postCreateGiftCardReward = async (request, response) => {
    let { partnerName, name, price, number } = request.body; 
    try {
        let giftCardReward = await createGiftCardReward(partnerName, name, price, number);

        return response.send(giftCardReward);
    } catch (error) {
        console.error(error)
        return response.sendStatus(400);
    }
}

const createDiscountCodeReward = async (partnerName, name, price, code) => {
    let partner = await Partner.findOne({ name: partnerName }) || await Partner.create({ name: partnerName });
    let reward = await Reward.findOne({ name: name, price: price, PartnerId: partner.id }) || await Reward.create({ name: name, price: price, PartnerId: partner.id });

    let discountCodeReward = await RewardDiscountCode.create({ code: code, RewardId: reward.id })
    return discountCodeReward;
} 

const postCreateDiscountCodeReward = async (request, response) => {
    let { partnerName, name, price, code } = request.body; 
    try {
        let discountCodeReward = await createDiscountCodeReward(partnerName, name, price, code);

        return response.send(discountCodeReward);
    } catch (error) {
        console.error(error)
        return response.sendStatus(400);
    }
}


const postRedeemGiftCardReward = async (request, response) => {
    let { userId, rewardId } = request.body;
    // TODO: Get user ID from the access_token
    try {
        let reward = await Reward.findOne({ where: { id: rewardId } });
        if (!reward)
            throw "Reward not found";
        
        let giftCardReward = await RewardGiftCard.findOne({ where: { RewardId: reward.id, status: 'valid' } });

        let { success, error } = await deductBalance(userId, reward.price);
        if (!success)
            throw error;

        giftCardReward.redeem();


        return response.send(giftCardReward);

    } catch (error) {
        console.error(error)
        return response.status(400).send({ message: error });
    }
}
const postRedeemDiscountCodeReward = async (request, response) => {
    let { userId, rewardId } = request.body;
    // TODO: Get user ID from the access_token
    try {
        let reward = await Reward.findOne({ where: { id: rewardId } });
        if (!reward)
            throw "Reward not found";
        
        let discountCodeReward = await RewardDiscountCode.findOne({ where: { RewardId: reward.id, status: 'valid' } });

        let { success, error } = await deductBalance(userId, reward.price);
        if (!success)
            throw error;

            discountCodeReward.redeem();


        return response.send(discountCodeReward);

    } catch (error) {
        console.error(error)
        return response.status(400).send({ message: error });
    }
}

module.exports = { postCreateGiftCardReward, postCreateDiscountCodeReward, postRedeemGiftCardReward, postRedeemDiscountCodeReward, getRewardsList };