const { request, response } = require('express');
const express = require('express');
// const session = require('express-session');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// get config vars
dotenv.config();

const tokenMaxAgeMs = parseInt(process.env.TOKEN_AGE_DAYS) * 24  * 3600000; 
const app = express();
const PORT = 8080;

const db = require('./models');

app.use(cookieParser());

// var SequelizeStore = require("connect-session-sequelize")(session.Store);
const accountRouter = require('./routers/account.router');
const walletRouter = require('./routers/wallet.router');
const transactionRouter = require('./routers/transaction.router');
// require('dotenv').config();



// function generateAccessToken(userId) {
// 	return jwt.sign(userId, process.env.TOKEN_SECRET, { expiresIn: `${process.env.TOKEN_AGE_DAYS}d` });
// }


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

// app.use(session({
// 	secret: "very secret key do not lose it",
// 	resave: false,
// 	store: new SequelizeStore({
// 		db: db.sequelize,
// 	}),
// 	saveUninitialized: false,
// 	cookie: {
// 		maxAge: 720 * 3600000
// 	}
// }))

app.use('/account', accountRouter);
app.use('/wallet', walletRouter);
app.use('/transaction', transactionRouter);

let { recomputeWallet } = require('./controllers/transaction.controller')
app.get('/', async (request, response) => {
	let { walletId, page = 0 } = request.query;
	// // let transaction = await db.sequelize.transaction();
	// let transaction;

	// // try {
	// 	transaction = await db.sequelize.transaction();
		let wallet = await db.Wallet.findOne({ where: { id: walletId } });
		wallet.balance = wallet.balance - 110;
		wallet.save();
	// 	let wallets = await db.Wallet.findOne({ where: { id: walletId }, skipLocked: true , transaction });
		
	// 	console.log(wallets);
		// db.Wallet.update({ balance: (wallet.balance + 1) }, { where: { id: walletId } });
		
	// 	recomputeWallet(walletId)
		

	// 	await transaction.commit();

		
	//   } catch (error) {
	  
	// 	// If the execution reaches this line, an error was thrown.
	// 	// We rollback the transaction.
	// 	await transaction.rollback();
	  
	//   }
	// console.log(wallets)
	// await t.commit();
	// console.log();
	return response.send({ message: "Main root" });
});

db.sequelize.sync({ force: false }).then((request) => {
	app.listen(PORT, () => {
		console.log(`Express server started on port ${PORT}.`);
	});
});
