const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors');


const db = require('./models');

app.use("/public",express.static(__dirname + "/public"));

// const { User } = require('./models');
// const UserClass = require('./controllers/user')
const userRouter = require('./routers/user.router');
const accountRouter = require('./routers/account.router');
app.use(cors({ optionsSuccessStatus:200}));
const path = require("path");
const cookieParser = require('cookie-parser');

app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');

const termsRoutes = require('./routers/terms.router');

// ... (other code)




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

app.use('/user', userRouter);
app.use('/account', accountRouter);

app.use('/terms', termsRoutes);


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
