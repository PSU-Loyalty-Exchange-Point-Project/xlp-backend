const express = require('express');
// const session = require('express-session');
// const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// // get config vars
dotenv.config();

const tokenMaxAgeMs = parseInt(process.env.TOKEN_AGE_DAYS) * 24  * 3600000; 
const app = express();
const PORT = process.env.PORT;
const cors = require('cors');
const fs = require('fs');

const db = require('./models');

// var bodyParser = require('body-parser')
// app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));

app.use("/public",express.static(__dirname + "/public"));
const accountRouter = require('./routers/account.router');
app.use(cors({ optionsSuccessStatus:200}));
const cookieParser = require('cookie-parser');
// var SequelizeStore = require("connect-session-sequelize")(session.Store);
const walletRouter = require('./routers/wallet.router');
const transactionRouter = require('./routers/transaction.router');
// require('dotenv').config();


const { viewBalance } = require('./controllers/wallet.controller');
const { viewTransactionList } = require('./controllers/transaction.controller');

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

app.use('/account', accountRouter);
app.use('/wallet', walletRouter);
app.use('/transaction', transactionRouter);

let { recomputeWallet } = require('./controllers/transaction.controller')

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
	});
});