const { request } = require('express');
const { GiftCard, Sequelize } = require('../models');


const postCreateGiftCard = async (request, response) => {
    let { value, price } = request.body;

    try {
        let giftCard = await GiftCard.create({ value: value, price: price });
        giftCard.save();

        if (!giftCard)
            throw "Unable to create gift card";

        return response.status(201).send({ message: "Gift card created" });

    } catch (error) {
        console.error(error);
        return response.status(400).send({ message: error });
    }
};

const postRedeemGiftCard = async (request, response) => {
    let { giftCardNumber } = request.body;

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

        giftCard.redeem();

        return response.send({ "giftCard": giftCard });

    } catch (error) {
        console.error(error);
        return response.status(400).send({ message: error });
    }
};


module.exports = { postCreateGiftCard, postRedeemGiftCard }