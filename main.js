const express = require('express');
const app = express();
const PORT = 8080;

const db = require('./models');

// const { User } = require('./models');
// const UserClass = require('./controllers/user')
const accountRouter = require('./routers/account.router');

// require('dotenv').config();



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

// app.get('/', async (request, response) => {
// 	const { verifyEmail } = require('./controllers/user.controller');

// 	var dat = await verifyEmail('sulaiman@kuthbanhosting.com', '');
//     response.send({success: true, data: dat})
// });


db.sequelize.sync({ force: true}).then((request) => {
	app.listen(PORT, () => {
		console.log(`Express server started on port ${PORT}.`);
	});
});
