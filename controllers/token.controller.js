const { request } = require('express');
const { Token, Sequelize } = require('../models');

const  createEmailVerificationToken = async (userObject) =>  {
    try {
        let expireDate = new Date(new Date().getTime() + (30 * 60 * 1000));

        var token = await Token.create({expiresAt: expireDate});
    
        userObject.addToken(token);
        return token.id;

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