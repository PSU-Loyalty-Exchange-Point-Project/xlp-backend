const express = require('express');
<<<<<<< Updated upstream
// const session = require('express-session');
// const jwt = require('jsonwebtoken');
=======
const session = require('express-session');
const jwt = require('jsonwebtoken');
>>>>>>> Stashed changes
const dotenv = require('dotenv');

// // get config vars
dotenv.config();

const tokenMaxAgeMs = parseInt(process.env.TOKEN_AGE_DAYS) * 24  * 3600000; 
const app = express();
<<<<<<< Updated upstream
const PORT = process.env.PORT;
const cors = require('cors');
const fs = require('fs');
=======
>>>>>>> Stashed changes

const db = require('./models');

// var bodyParser = require('body-parser')
// app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));

var SequelizeStore = require("connect-session-sequelize")(session.Store);
const accountRouter = require('./routers/account.router');
const walletRouter = require('./routers/wallet.router');


// async function assertDatabaseConnectionOk() {
// 	console.log(`Checking database connection...`);
// 	try {
// 		await db.sequelize.authenticate();
// 		console.log('Database connection OK!');
// 	} catch (error) {
// 		console.log('Unable to connect to the database:');
// 		console.log(error.message);
// 		process.exit(1);
// 	}
// }

// async function init() {
// 	await assertDatabaseConnectionOk();

// 	console.log(`Starting Sequelize + Express example on port ${PORT}...`);

// 	app.listen(PORT, () => {
// 		console.log(`Express server started on port ${PORT}. Try some routes, such as '/api/users'.`);
// 	});
// }

// init();
app.use(express.json())

<<<<<<< Updated upstream
=======
app.use(session({
	secret: process.env.REFRESH_TOKEN_SECRET,
	resave: false,
	store: new SequelizeStore({
		db: db.sequelize,
	}),
	saveUninitialized: false,
	cookie: {
		maxAge: process.env.REFRESH_TOKEN_AGE * 3600000
	}
}))

>>>>>>> Stashed changes
app.use('/account', accountRouter);
app.use('/wallet', walletRouter);
app.use('/transaction', transactionRouter);

app.use('/wallet', walletRouter);

app.use('/wallet', walletRouter);

app.get('/', (request, response) => {

let countryCodesObjectsList = JSON.parse(fs.readFileSync('./staticData/countryCodes.json'));
let countryCodeDialCodeList = []

app.get('/', async (request, response) => {
	// countryCodesObjectsList.forEach((countryCodeObject) => {
	// 	countryCodeDialCodeList.push(countryCodeObject.dial_code);
	// });
	// console.log(countryCodeDialCodeList);
	// console.log(countryCodeDialCodeList.includes("+966"));
	// // console.log(countryCodesList.length);
	// return response.send({ message: "Main root" });
});

<<<<<<< Updated upstream
app.get('/dashboard', async (request, response) => {
	let balance = await viewBalance('b4d368f8-0438-4905-97af-3492e5a276fa');
	// let userObject = await db.User.findByPk('b4d368f8-0438-4905-97af-3492e5a276fa');
	let transactions = await viewTransactionList(balance.id, 10, 0);
	// console.log(transactions);
	var transactionsStr = "<ol>";
	transactions.forEach((transaction) => {
		// console.log(transaction.id)
		let str = `<li>${transaction.type} ${transaction.amount} ${transaction.createdAt}</li>`;

		transactionsStr = transactionsStr + str;
	});
	transactionsStr.concat("</ol>")
	console.log(transactionsStr);
	return response.send(`<h1>Dashboard</h1> <br>  <span style="font-weight: bold;">Balance:</span> ${balance.balance} points <h2>Transactions</h2>${transactionsStr} <a href="/account/login">Logout</a>`)
});

db.sequelize.sync({ force: true }).then((request) => {
	app.listen(PORT, () => {
		console.log(`Express server started on port ${PORT}.`);
=======
db.sequelize.sync({ force: true}).then((request) => {
	app.listen(process.env.PORT, () => {
		console.log(`Express server started on port ${process.env.PORT}.`);
>>>>>>> Stashed changes
	});
});