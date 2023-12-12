const { OTPCode, User, Sequelize } = require('../models');
const { createEmailVerificationToken } = require('./token.controller');
const jwt = require('jsonwebtoken');
let tokenOptions = {};

let generateAccessToken = (userId, expireDuration = 30) => {
	tokenOptions = { 
		httpOnly: true, 
		secure: process.env.NODE_ENV === "production", 
		maxAge: expireDuration * 60 * 1000
	}

	return jwt.sign({userId: userId}, process.env.TOKEN_SECRET, { expiresIn: `${expireDuration}m` });
}

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

const getVerifyOTP = async (request, response) => {
	// This page get the obscured phone number for the uid provided

	let uid = request.params.uid;

	try {
		let userId = atob(uid);
		let user = await User.findOne({ where: { id: userId } });
		if (!user)
            throw "UID error";
            
		return response.status(200).send({ userPhoneNumber: user.obscuredPhoneNumber() });
		
	} catch (error) {
		console.error(error)
		return response.status(400).send({ message: error });
	}
}

const postVerifyOTP = async (request, response) => {
    // Gets uid from endpoint params & code from request body
    // converts uid from base64 string to normal string
    // Gets uid

    let uid = request.params.uid;
    let { code } = request.body;

    try {
        let userId = atob(uid);
        let user = await User.findOne({ where: { id: userId } });

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

        OTP.consumeOTP();

        if (user.status == 'inactive') {
            // OTP sent in registration
            let token = await createEmailVerificationToken(user.id);

            if (!token)
                throw "Invalid OTP";

            user.setPhoneVerifiedStatus();
            token.sendToken();

            return response.send({ redirectLocation: '/account/login', message: "OTP confirmed" });

        } else if (user.status == 'active') {
            // OTP sent in login
            let generatedAccessToken = generateAccessToken(user.id);

            return response.status(200).send({ 
                redirectLocation: '/dashboard',
                headers: {
                    access_token: { 
                        token: generatedAccessToken, 
                        options: tokenOptions 
                    }
                } 
            });
        } else {
            throw "Invalid OTP"
        }
        

    } catch (error) {
        console.error(error);
        return response.status(400).send({ message: error });
    }
}

module.exports = { getVerifyOTP, postVerifyOTP, createOTP };