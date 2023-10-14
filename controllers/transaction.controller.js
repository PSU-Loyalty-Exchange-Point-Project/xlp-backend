
const { request } = require('express');
const { Transaction } = require('../models');


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
            throw "Error creating a user transaction"

    } catch (error) {
        return error;
    }
};

module.exports = {
    createTransaction
}