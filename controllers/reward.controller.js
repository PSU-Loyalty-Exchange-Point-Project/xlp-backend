const { User, Partner, Reward, RewardGiftCard, RewardDiscountCode } = require('../models');
const { deductBalance } = require('./wallet.controller');
const { getDataFromToken } = require('./account.controller');

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

const getRewardDetails = async (request, response) => {
    try {
        let rewardId = request.params.rewardId;

        let reward = await Reward.findOne({ where: { id: rewardId } });

        return response.send(reward);
    } catch (error) {

        return response.status(400).send({ message: error });
    }

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


const redeemGiftCardReward = async (rewardId, userId) => {
    try {
        let reward = await Reward.findOne({ where: { id: rewardId } });
        if (!reward)
            throw "Reward not found";
        
        let giftCardReward = await RewardGiftCard.findOne({ where: { RewardId: reward.id, status: 'valid' } });

        let { success, error } = await deductBalance(userId, reward.price);
        if (!success)
            throw error;

        giftCardReward.redeem();


        return giftCardReward;

    } catch (error) {
        console.error(error)
        return null;
    }
}
const redeemDiscountCodeReward = async (rewardId, userId) => {
    try {
        let reward = await Reward.findOne({ where: { id: rewardId } });
        if (!reward)
            throw "Reward not found";
        
        let discountCodeReward = await RewardDiscountCode.findOne({ where: { RewardId: reward.id, status: 'valid' } });

        let { success, error } = await deductBalance(userId, reward.price);
        if (!success)
            throw error;

            discountCodeReward.redeem();


        return discountCodeReward;

    } catch (error) {
        console.error(error)
        return null;
    }
}

const postRedeemReward = async (request, response) => {
    try {
        let rewardId = request.params.rewardId;
        let reward = await Reward.findOne({ where: { id: rewardId } });
        if (!reward)
            throw "Reward not found";
        let access_token = request.headers.access_token;
		let data = await getDataFromToken(access_token);
        let user = await User.findOne({ where: { id: data.userId, status: "active"  } });
        console.log(user);
        if (!user)
            throw "User doesn't exist";
        
        let giftCardReward = await RewardGiftCard.findOne({ where: { RewardId: reward.id  } });
        let discountCodeReward = await RewardDiscountCode.findOne({ where: { RewardId: reward.id  } });
        let returnReturn;
        
        if (giftCardReward) {
            returnReturn = await redeemGiftCardReward(reward.id, user.id);
            
        } else if (discountCodeReward) {
            returnReturn = await redeemDiscountCodeReward(reward.id, user.id);
        } else {
            throw "Cannot redeem reward";
        }
        if (!returnReturn)
            throw "Cannot redeem reward";
        return response.send(returnReturn);
    } catch (error) {

        return response.status(400).send(error);
    }
}


module.exports = { rewardsList, getRewardDetails, postCreateGiftCardReward, postCreateDiscountCodeReward, postRedeemReward, getRewardsList };