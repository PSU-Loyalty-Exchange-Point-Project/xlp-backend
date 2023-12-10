const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('./token.controller');
const { createWallet } = require('./wallet.controller');
const { createOTP } = require('./otp.controller');
const { authenticate } = require('../models/user.model');
const { countryCodeExists } = require('../staticData/countryCodes');

const getDataFromToken = async (access_token) => {
	// It will verify the token
	// it will return the data from the token
	
	try {
		const data = jwt.verify(access_token, process.env.TOKEN_SECRET);
		
		return data;
		
	} catch (error) {
		console.error(error);
		return null;
	}	
}

const postIsAuthorized = async (request, response, next) => {
	// Frontend sends the access token
	// It will verify the token
	// After the token is verified
	// Queries the user from the user ID provided by the data
	// If the user exists it responds with a 200 status code
	// If the user doesn't exist it responds with a 403 status code

	let { access_token } = request.body;
	
	try {
		const data = jwt.verify(access_token, process.env.TOKEN_SECRET);
		let user = await User.findOne({ where: { id: data.userId, status: 'active' } });

		if (!user)
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

		if (!OTPCode)
			throw "Failed to create OTP";
		
		OTPCode.sendOTP();
		return response.status(201).send({ uid: `${user.getUID()}` });
		
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
	// Confirm that the password and email exists
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
		
		let OTPCode = await createOTP(user.id);

		if (!OTPCode)
			throw "Failed to create OTP";

		OTPCode.sendOTP();

		return response.status(200).send({ uid: `${user.getUID()}` });

	} catch (error) {

		return response.status(400).send({ message: error });
	}
}

const postLogout = (request, response) => {
	// Frontend sends the access token
	// It will verify the token
	// After the token is verified
	// If the token is verified it responds with a 200 status code
	// If the user doesn't exist it responds with a 400 status code

	try {
		let access_token = request.headers.access_token;
		
		if(!getDataFromToken(access_token))
			throw "Error";
	

		return response.sendStatus(200);

	} catch (error) {
		console.error(error);
		return response.sendStatus(400);
	}
}

const getActivateAccount = async (request, response) => {
	// This link is sent the user via email
	// The frontend sends a request to this endpoint with the uid & token
	// The uid is converted from base64 string to a uuid string
	// The user is queried from the user ID from the converted uid
	// It verifies the token by providing both token and user ID and returns a token object
	// If everything is verified the user status is set to activated & the token is consumed
	// Finally it creates a wallet for the user

	let { uid, token } = request.params;
	try {

		let userId = atob(uid);

		let user = await User.findOne({ where: { id: userId, status: "phone verified" } });
		
		if (!user)
			throw "Token is invalid";

		let tokenObject = await verifyToken(token, user.id)

		if (!tokenObject)
			throw "Token is invalid";

		
		user.setActivatedStatus();

		tokenObject.consumeToken();

		createWallet(user);

		return response.status(200).send({ message: "Email verified successfully" });
		
	} catch (error) {
		return response.status(400).send({ message: error });
	}
}

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
}

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
}

module.exports = { postRegister, postLogin, postLogout, postIsAuthorized, getActivateAccount, postChangePassword, getDataFromToken };