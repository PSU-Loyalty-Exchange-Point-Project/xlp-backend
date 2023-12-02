const bcrypt = require('bcrypt');
const { response } = require('express');
const { User, Token, OTPCode, Sequelize } = require('../models');
const jwt = require('jsonwebtoken');
const { verifyToken, createEmailVerificationToken } = require('./token.controller');
const { createWallet } = require('./wallet.controller');
const { sendOTP, createOTP } = require('./otp.controller');
const { use } = require('chai');
const { authenticate } = require('../models/user.model');
const { countryCodeExists } = require('../staticData/countryCodes');

const isAuthorized = async (request, response, next) => {
	// Not functional yet
	let { access_token } = request.body;
	
	try {
		const data = jwt.verify(access_token, process.env.TOKEN_SECRET);
		let user = await User.findOne({ where: { id: data.userId, status: 'active' } });

		if (user == null)
			throw "User doesn't exist";
		
		return response.sendStatus(200); 
		
	} catch (error) {
		return response.sendStatus(403);
	}
	
}

const postRegister = async (request, response) => {
	// This function will receive the data 
	// confirm that the passwords match
	// confirm that the country dial code exists
	// It will then create the user object
	// It will then generate an OTP 
	// the OTP will be sent to the user
	// The frontend must then redirect the user to an OTP confirmation screen

	let { name, email, password, rePassword, countryCode, phoneNumber } = request.body;
	let user, OTPCode;

	try {
		if (password !== rePassword) 
			throw "Passwords do not match";
			
		if (!countryCodeExists(countryCode))
			throw "Country code is incorrect";

		user = await new User({ name: name, email: email, password: password, phoneNumber: countryCode + phoneNumber });
		await user.save();

		if (!user)
			throw "Failed to create user";

		OTPCode = await createOTP(user.id);
		await OTPCode.save();

		if (!OTPCode)
			throw "Failed to create OTP";
		
		OTPCode.sendOTP();
		return response.sendStatus(201);
		
	} catch (error) {
		if (user)
			user.destroy();
		
		if (OTPCode)
			OTPCode.destroy();
		
		if (error.name == "SequelizeUniqueConstraintError")
			error = "User already exists";

		console.error(error);
		
		return	response.status(400).send({ message: error });
	}
}

const postLogin = async (request, response) => {
	// This function will receive the data 
	// confirm that the password and email exists
	// It will then generate an OTP 
	// the OTP will be sent to the user
	// The frontend must then redirect the user to an OTP confirmation screen

	let { email, password } = request.body;
	
	try {
		if (!email || !password) 
			throw 'Request missing username and/or password param';

		let user = await authenticate(email, password);

		if(!user) 
			throw "Incorrect email or password";
		
		
	// login
	// 	let userObject = await User.findOne({ where: { email: email, status: 'active' } });
	// 	console.log(userObject)

	// 	return response.status(200).send({ access_token: { token: generateAccessToken({ userId: user.id }), tokenOptions } });
	// 	// return response.redirect('/dashboard');

	} catch (error) {

		return response.status(400).send({ message: error });
	}
}

const postLogout = (request, response) => {
	let { access_token } = request.body;

	try {
		if (access_token == null) throw "No access token params";

		jwt.verify(access_token, process.env.TOKEN_SECRET);

		return response
			.clearCookie("access_token")
			.status(200)
			.json({ message: "Successfully logged out!" });
	} catch (error) {
		console.error(error);
		return response.sendStatus(400);
	}
};

const getActivateAccount = async (request, response) => {
	let { uid, token } = request.params;
	try {

		let userId = atob(uid);

		let user = await User.findOne({ where: { id: userId, status: "phone verified" } });
		
		if (!user)
			throw "Token is invalid";
		
		console.log('before token query')
		let tokenObject = await Token.findOne({
			where: {
				id: token,
				UserId: user.id,
				status: 'valid',
                expiresAt: {
                    [Sequelize.Op.gt]: new Date()
                }
			}
		})

		if (!tokenObject)
			throw "Token is invalid";

		
		user.setActivatedStatus();

		tokenObject.consumeToken();

		createWallet(user);

		return response.status(200).send({ message: "Email verified successfully" });
		
	} catch (error) {
		return response.status(400).send({ message: error });
	}
};

const postChangePassword = async (request, response) => {
	let { userId, oldPassword, newPassword } = request.body;

	try {

		let user = await User.findOne({ where: { id: userId, status: "active" } });

		if (!user)
			throw "User not found";


		if (!user.passwordValid(oldPassword))
			throw "Password could not be verified";
		
		if (user.passwordValid(newPassword))
			throw "Password cannot be the same as the existing one";

		
		let passwordChanged = user.setPassword(newPassword);
		
		if (!passwordChanged)
			throw "An error occurred while changing the password"
		
		return response.status(200).send({ message: "Password changed successfully" });
		
	} catch (error) {
		console.error(error)
		return response.status(400).send({ message: error });
	}
};

const postResetPassword = async (request, response) => {
	let { userId, newPassword } = request.body;

	try {

		let user = await User.findOne({ where: { id: userId, status: "forget password" } });

		if (!user)
			throw "User not found";

		
		if (user.passwordValid(newPassword))
			throw "Password cannot be the same as the existing one";

		
		let passwordChanged = user.setPassword(newPassword);
		
		if (!passwordChanged)
			throw "An error occurred while changing the password"
		
		return response.status(200).send({ message: "Password changed successfully" });
		
	} catch (error) {
		console.error(error)
		return response.status(400).send({ message: error });
	}
};


let tokenOptions = { 
	httpOnly: true, 
	secure: process.env.NODE_ENV === "production", 
	maxAge: 60000
}

let generateAccessToken = (userId) => {
	return jwt.sign(userId, process.env.TOKEN_SECRET, { expiresIn: `1m` });
}

module.exports = { postRegister, postLogin, postLogout, isAuthorized, getActivateAccount, postChangePassword };