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

app.get('/', (request, response) => {

	return response.send({ message: "Main root" });
});

db.sequelize.sync({ force: true}).then((request) => {
	app.listen(PORT, () => {
		console.log(`Express server started on port ${PORT}.`);
	});
});
