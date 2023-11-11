const bcrypt = require('bcrypt');
const { response } = require('express');
const { User, Token, OTPCode } = require('../models');
const jwt = require('jsonwebtoken');
const { verifyToken, createEmailVerificationToken } = require('./token.controller');
const { createWallet } = require('./wallet.controller');
const { sendOTP, createOTP } = require('./otp.controller');
const { use } = require('chai');
const { validate } = require('uuid');
// console.log(User)

const isAuthorized = async (request, response, next) => {
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
	// It will then create the user object
	// The frontend must then redirect the user to a OTP confirmation screen

	let { name, email, password, rePassword, phoneNumber } = request.body;
	let user, OTPCode;
	try {
		if (password !== rePassword) 
			throw "Passwords do not match";
		
		user = await new User({ name: name, email: email, password: password, phoneNumber: phoneNumber });
		await user.save();
		
		OTPCode = await createOTP(user);
		
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
	let { email, password } = request.body;
	console.log(request.body);
	if (!email || !password) {
		return response.status(400).send('Request missing username and/or password param')
	}
	try {
		let userObject = await User.findOne({ where: { email: email, status: 'active' } });
		console.log(userObject)
		if (!checkPassword(password, userObject.password))
			throw "Incorrect email or password"
		return response.status(200).send({ access_token: { token: generateAccessToken({ userId: user.id }), tokenOptions } });
		// return response.redirect('/dashboard');

	} catch (error) {
		console.error(error);
		return response.status(400).send({ message: 'Authentication unsuccessful' });
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
	try {
		let { uid, token } = request.params;
		let userId = atob(uid);

		let user = await User.findOne({ where: { id: userId, status: "inactive" } });
		if (user == null)
			throw "Token is invalid";
		
		let tokenValid = await verifyToken(token, user.id)
		if (!tokenValid)
			throw "Token is invalid";
		
		activateAccount(user);
		createWallet(user);
		return response.status(200).send({ message: "Email verified successfully" });
		
	} catch (error) {
		return response.status(400).send({ message: "Token is invalid" });
	}
};


let checkPassword = (password, re_password, passwordHash) => 
	bcrypt.compareSync(password.toString(), 
	passwordHash.toString(), 
	(error, result) => {

	//if error than throw error
	if (error) throw error;

	//if both match than you can do anything
	if (result) 
		return true;
	else 
		return false;

});

let activateAccount = (userObject) => {
	userObject.status = 'active';
	userObject.save();
}

let tokenOptions = { 
	httpOnly: true, 
	secure: process.env.NODE_ENV === "production", 
	maxAge: 60000
}

let generateAccessToken = (userId) => {
	return jwt.sign(userId, process.env.TOKEN_SECRET, { expiresIn: `1m` });
}

module.exports = { postRegister, postLogin, postLogout, isAuthorized, checkPassword, getActivateAccount };