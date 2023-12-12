const { GiftCard, User, Sequelize } = require('../models');
const { addBalance } = require('./wallet.controller');
const { getDataFromToken } = require('./account.controller');

const postCreateGiftCard = async (request, response) => {
    let { value, price } = request.body;

    try {
        let giftCard = await GiftCard.create({ value: value, price: price });

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
        let access_token = request.headers.access_token;
		let data = await getDataFromToken(access_token);

		let user = await User.findOne({ where: { id: data.userId, status: "active"  } });
        if (!user)
            throw "User doesn't exist";

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

        let transaction = await addBalance(user.id, giftCard.value, `Redeemed gift card with ID: ${giftCard.id}`);    
        
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