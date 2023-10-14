const { request } = require('express');
const { Wallet } = require('../models');
const { createTransaction } = require('./transaction.controller');


const createWallet = async (userObject) =>  {
    try {
        let wallet = await Wallet.create({ balance: 100 });
        wallet.setUser(userObject);
        // userObject.setWallet(wallet);
        
        if (wallet == null)
            throw "Error creating a user wallet"

    } catch (error) {
        return error;
    }
};

const viewBalance = async (userId) => {
    try {
        let wallet = await Wallet.findOne({ where: { UserId: userId } });
        if (wallet == null)
            throw "Wallet does not exist"
        
        return wallet.balance;    
    } catch (error) {
        return error;
    }
}

const deductBalance = async (userId, amount) => {
    let wallet = await Wallet.findOne({ where: { UserId: userId } });
    try {
        
        if (wallet == null)
            throw "Wallet does not exist"

        if (wallet.balance < amount)
            throw "Wallet does not have sufficient balance for this transaction"
        
        wallet.balance = wallet.balance - amount;
        
        wallet.save();

        await createTransaction(amount, "deduct", null, wallet);

        return wallet.balance;    
    } catch (error) {

        await createTransaction(amount, "fail", error, wallet);
        return error;
    }
}

const addBalance = async (userId, amount) => {
    let wallet = await Wallet.findOne({ where: { UserId: userId } });
    try {
        
        if (wallet == null)
            throw "Wallet does not exist"
        
        wallet.balance = wallet.balance + amount;
        
        wallet.save();

        await createTransaction(amount, "gain", null, wallet);

        return wallet.balance;    
    } catch (error) {

        await createTransaction(amount, "fail", error, wallet);
        return error;
    }
}

const getUserBalance = async (request, response) => {
    try {
        let { userId } = request.query;
        
        let balance = await viewBalance(userId);
        if (typeof balance === typeof "")
            throw balance;

        return response.send({ "user": userId, "balance": balance });
    } catch (error) {

        return response.status(400).send({ message: error });
    }
}

const postDeductBalance = async (request, response) => {
    try {
        let { userId, amount } = request.body;
        
        let newBalance = await deductBalance(userId, amount);
        if (typeof newBalance === typeof "")
            throw newBalance;

        return response.send({ "user": userId, "balance": newBalance, "deductedAmount": amount });
    } catch (error) {

        return response.status(400).send({ message: error });
    }
}

const postAddBalance = async (request, response) => {
    try {
        let { userId, amount } = request.body;
        
        let newBalance = await addBalance(userId, amount);
        if (typeof newBalance === typeof "")
            throw newBalance;

        return response.send({ "user": userId, "balance": newBalance, "deductedAmount": amount });
    } catch (error) {

        return response.status(400).send({ message: error });
    }
}

module.exports = { createWallet, getUserBalance, postDeductBalance, postAddBalance }