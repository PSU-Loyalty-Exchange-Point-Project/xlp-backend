const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
// // get config vars
dotenv.config();

const app = express();
const PORT = process.env.PORT;

const db = require('./models');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json())

const { viewBalance } = require('./controllers/wallet.controller');
const { getDataFromToken } = require('./controllers/account.controller');



const accountRouter = require('./routers/account.router');
const walletRouter = require('./routers/wallet.router');
const transactionRouter = require('./routers/transaction.router');
const giftCardRouter = require('./routers/giftCard.router');

app.use('/account', accountRouter);
app.use('/wallet', walletRouter);
app.use('/transaction', transactionRouter);
app.use('/gift-card', giftCardRouter);

let { recomputeWallet } = require('./controllers/transaction.controller')

const { User, Wallet } = require('./models');
const { viewTransactionList } = require('./controllers/transaction.controller');


app.get('/dashboard', async (request, response) => {
	try {
		let access_token = request.headers.access_token;
		let data = await getDataFromToken(access_token);

		let user = await User.findOne({ where: { id: data.userId, status: "active"  } });
		if (!user)
			throw "User not found";

		let wallet = await Wallet.findOne({ where: { UserId: user.id } })
		if (!wallet)
			throw "User not found";
		
		let transactions = await  viewTransactionList(wallet.id, 5, 0)
		if (!transactions)
			throw "Transactions not found";

		return response.status(200).send({ balance: wallet.getBalance(), transactions: transactions })
	
	} catch (error) {
		return response.sendStatus(400);
	}
});

db.sequelize.sync({ force: true }).then((request) => {
	app.listen(PORT, () => {
		console.log(`Express server started on port ${PORT}.`);
	});
});