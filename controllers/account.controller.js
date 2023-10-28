const bcrypt = require('bcrypt');
const { response } = require('express');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { verifyToken, createEmailVerificationToken } = require('./token.controller');
const { createWallet } = require('./wallet.controller');

dotenv.config();

const getLogin =  (request, response) => {
  response.render('login');
}

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
	let { email, password, phoneNumber } = request.body;

	try {
		let user = await User.create({ email: email.toString(), password: password.toString(), phoneNumber: phoneNumber.toString() });
		
		let tokenId = await createEmailVerificationToken(user);
		let uid = btoa(user.id);

		return response.status(201).send({ user: { "verificationLink": `http://${request.hostname}:${process.env.PORT}/account/activate/${uid}/${tokenId}`} })

	} catch (error) {
		console.error(error);
		return	response.status(400).send({ message: 'Invalid email or password' });
	} 
}

const postLogin = (request, response) => {
	let { email, password } = request.body;

	if (!email || !password) {
		return response.status(400).send('Request missing username or password param')
	}
	try {
		let userObject = User.findOne({ where: { email: email, status: 'active' } });
		
		if (!checkPassword(password, userObject.password))
			throw "Incorrect email or password"
		return response.status(200).send({ access_token: { token: generateAccessToken({ userId: user.id }), tokenOptions } });

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



let checkPassword = (password, passwordHash) => 
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
module.exports = { postRegister, postLogin, getLogin, postLogout, isAuthorized, checkPassword, getActivateAccount };