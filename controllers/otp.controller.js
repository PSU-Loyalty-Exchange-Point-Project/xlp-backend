const { request } = require('express');
const { OTPCode, User, Sequelize } = require('../models');

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const createOTP = async (userObject) => {
    try { 
        let user = userObject;    
    
        let OTPObject = await new OTPCode(user);
        await OTPObject.save();
    
        return OTPObject;
    }
    catch (error) {
        console.error(error);
        
        return null;
    }

}
const sendOTP = async (userObjects) => {
    // check if a code was sent before
    // if a code was sent before change status to inactive
    // if there are 5 inactive in the last 24 hours don't send OTP
    let OTP = await createOTP(userObjects);
    client.messages
    .create({
        body: `Your XLP code is ${OTP}`,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:+${userObjects.phoneNumber}`
    })
    .then(message => console.log(message.sid));
};

const verifyOTP = async (userObject, code) => {
    try {
        let OTPObject = await OTPCode.findOne(
            { where: 
                { 
                    code: code, 
                    UserId: userObject.id,
                    status: "valid",
                    expiresAt: {
                        [Sequelize.Op.gt]: new Date()
                    }
                } 
            });
        return OTPObject;

    } catch (error) {
        console.log(error);
        return false;
    }

};

const consumeOTP = async (OTPObject) => {
    OTPCode.status.consumed;
    OTPCode.save();
};

const postCheckOTP = async (request, response) => {
    let { code, phoneNumber } = request.body;
    console.log(request.body);
    try {
        let userObject = await User.findOne({ where: { phoneNumber: phoneNumber } });
        let isOTPVerified = await verifyOTP(userObject, code);
        if (!isOTPVerified)
            throw "Could not verify OTP";
        return response.send({ message: "OTP confirmed" });
    } catch (error) {
        return response.status(400).send({ message: error });
    }
};
module.exports = { sendOTP, verifyOTP, postCheckOTP, createOTP }
