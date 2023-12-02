const { request } = require('express');
const { Token, Sequelize } = require('../models');

const  createEmailVerificationToken = async (userId) =>  {
    try {
        let token = await new Token({ UserId: userId});
        await token.save();

        return token;

    } catch (error) {
        console.error(error);
        return null;
    }
};



const verifyToken = async (tokenId, userId) => {
    try {
        let tokenObject = await Token.findOne(
            {
                where: {
                    id: tokenId,
                    UserId: userId,
                    expiresAt: {
                        [Sequelize.Op.gt]: new Date()
                    }
                }
            });
        
        tokenObject.expiresAt = new Date();
        await tokenObject.save();

        return true;
    } catch (error) {
        return false;
    }
}

module.exports = { verifyToken, createEmailVerificationToken }