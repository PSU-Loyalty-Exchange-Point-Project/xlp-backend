const { request } = require('express');
const { GiftCard, Sequelize } = require('../models');
const { addBalance } = require('./wallet.controller')

const postCreateGiftCard = async (request, response) => {
    let { value, price } = request.body;

    try {
        let giftCard = await GiftCard.create({ value: value, price: price });
        giftCard.save(); // Might not be necessary

        if (!giftCard)
            throw "Unable to create gift card";

        return response.status(201).send({ message: "Gift card created" });

    } catch (error) {
        console.error(error);
        return response.status(400).send({ message: error });
    }
};

const postRedeemGiftCard = async (request, response) => {
    let { userId, giftCardNumber } = request.body;

    try {
        let giftCard = await GiftCard.findOne({ 
            where: { 
                number: giftCardNumber, 
                status: "valid",
                expiresAt: {
                    [Sequelize.Op.gt]: new Date()
                }
            }
        });
        
        if (!giftCard)
            throw "Unable to redeem gift card";

        let transaction = await addBalance(userId, giftCard.value, `Redeemed gift card with ID: ${giftCard.id}`);    
        
        if (!transaction.success)
            throw transaction.error;
        
        giftCard.redeem();

        return response.send({ "giftCard": giftCard });

    } catch (error) {
        console.error(error);
        return response.status(400).send({ message: error });
    }
};


module.exports = { postCreateGiftCard, postRedeemGiftCard }