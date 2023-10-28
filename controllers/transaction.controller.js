const { request } = require('express');
const { Transaction, User, sequelize, Wallet } = require('../models');


const createTransaction = async (transactionAmount, transactionType, transactionNote = null, walletObject) =>  {
    try {
        let transaction = await Transaction.create(
            { 
                amount: transactionAmount, 
                type: transactionType,
                note: transactionNote
            });

        walletObject.addTransaction(transaction);
        
        if (transaction == null)
            throw "Error creating transaction"
        
        return true;
    } catch (error) {
        return error;
    }
};

const viewTransaction = async (transactionId) =>  {
    try {
        let transaction = await Transaction.findOne({ where: { id: transactionId } });

        
        if (transaction == null)
            throw "Transaction not found"

        return transaction;
    } catch (error) {
        return error;
    }
};

const viewTransactionList = async (walletId, transactionsPerPage, page) =>  {
    try {
        let transactions = await Transaction.findAll({ 
            where: { WalletId: walletId },
            order: [['createdAt', 'DESC']],
            offset: page * transactionsPerPage,
            limit: transactionsPerPage
        });
        // console.log(transactions)
        // console.log(transactions.length)
        // console.log(transactions == [])

        if (transactions.length == 0) // wallet does not exist
            throw "Wallet not found"
        return transactions;
    } catch (error) {
        return error;
    }
};


const getWalletTransactions = async (walletId) => {
    // let gainTransactions = await Transaction.findAll({ where: { WalletId: walletId, status: "gain" }});
    // let deductTransactions = await Transaction.findAll({ where: { WalletId: walletId, status: "deduct" }});
    let transactions = await Transaction.findAll({
        where: { WalletId: walletId },
        attributes: [
            'type',
            [sequelize.fn('sum', sequelize.col('amount')), 'total_amount'],
          ],
          raw: true,
          group: ['type'],
    });

    let gainedPoints = transactions.find(({ type }) => type === "gain").total_amount;
    let deductedPoints = transactions.find(({ type }) => type === "deduct").total_amount;

    return { gainedPoints: gainedPoints, deductedPoints: deductedPoints}
}

const recomputeWallet = async (walletId) => {
    let walletTransactions =  await getWalletTransactions(walletId);
    let computedBalance = walletTransactions.gainedPoints - walletTransactions.deductedPoints;
    let walletBalance = (await Wallet.findByPk(walletId)).balance;

    if (computedBalance != walletBalance )
        console.error(`Discrepancy found!\n> walletBalance: ${walletBalance}\n> computedBalance: ${computedBalance}`)
}

const getRecentTransactions = async (request, response) => {
    let { walletId, page = 0 } = request.query;
    recomputeWallet(walletId);

    try {
       
        let recentTransactions = await viewTransactionList(walletId, 10, page);
        // if (typeof balance === typeof "")
        //     throw balance;

        return response.send({ "user": walletId, "transactions": recentTransactions });
    } catch (error) {

        return response.status(400).send({ message: error });
    }
}

module.exports = {
    createTransaction,
    getRecentTransactions,
    recomputeWallet
}