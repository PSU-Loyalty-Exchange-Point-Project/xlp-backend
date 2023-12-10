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
        let token = await Token.findOne(
            {
                where: {
                    id: tokenId,
                    UserId: userId,
                    status: 'valid',
                    expiresAt: {
                        [Sequelize.Op.gt]: new Date()
                    }
                }
            });

        return token;
    } catch (error) {
        return null;
    }
}

module.exports = { verifyToken, createEmailVerificationToken }