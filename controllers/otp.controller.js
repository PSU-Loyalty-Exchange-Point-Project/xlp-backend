const { request } = require('express');
const { OTPCode, User, Sequelize } = require('../models');
const { createEmailVerificationToken } = require('./token.controller');


const createOTP = async (userId) => {
    try { 

        let OTPObject = await new OTPCode({UserId: userId});
        await OTPObject.save()
        
        return OTPObject;
    }
    catch (error) {
        console.error(error);
        
        return null;
    }

}

const postCheckOTP = async (request, response) => {
    let { code, phoneNumber } = request.body;

    try {
        let user = await User.findOne({ where: { phoneNumber: phoneNumber, status: 'inactive' } });
        
        if (!user)
            throw "Invalid OTP";
        let OTP = await OTPCode.findOne({ 
            where: { 
                code: code, 
                UserId: user.id, 
                status: 'valid',
                expiresAt: {
                    [Sequelize.Op.gt]: new Date()
                }
            } 
        });

        if (!OTP)
            throw "Invalid OTP";

        let token = await createEmailVerificationToken(user.id);

        if (!token)
            throw "Invalid OTP";

        OTP.consumeOTP();
        user.setPhoneVerifiedStatus();
        token.sendToken();
        return response.send({ message: "OTP confirmed" });

    } catch (error) {
        console.error(error);
        return response.status(400).send({ message: error });
    }
}

module.exports = { postCheckOTP, createOTP }
