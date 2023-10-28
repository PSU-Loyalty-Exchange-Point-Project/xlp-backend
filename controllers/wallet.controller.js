const { request } = require('express');
const { Wallet } = require('../models');
const { createTransaction, recomputeWallet } = require('./transaction.controller');


const createWallet = async (userObject) =>  {
    try {
        let wallet = await Wallet.create();
        wallet.setUser(userObject);
        // userObject.setWallet(wallet);
        
        if (wallet == null)
            throw "Error creating a user wallet"

    } catch (error) {
        return error;
    }
};

const computeBalance = async (walletId) => {
    try {
        let wallet = await Wallet.findOne({ where: { id: walletId } });
        
        if (!wallet)
            throw "Wallet not found"

        
        
    } catch (error) {
        return error;
    }

}

const viewBalance = async (userId) => {
    let wallet = await Wallet.findOne({ where: { UserId: userId } });
    if (!wallet)
        return null;
    
    return { id: wallet.id, balance: wallet.balance }
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

        recomputeWallet(wallet.id);

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
        console.log('#1')
        if (!Number.isInteger(wallet.balance))
            throw "Number must be an integer";
        
        console.log('#2')
        wallet.save();
    

        await createTransaction(amount, "gain", null, wallet);

        recomputeWallet(wallet.id);

        return wallet.balance;    
    } catch (error) {
        console.log(error);
        await createTransaction(amount, "fail", error, wallet);
        return { success: false, message: error };
    }
}

const getUserWallet = async (request, response) => {
    try {
        let { userId } = request.query;
        
        let wallet = await viewBalance(userId);

        if (!wallet)
            throw "Wallet no found";

        return response.send({ "useId": userId, "wallet": { "id": wallet.id, "balance": wallet.balance }});
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
        
        let ss = await addBalance(userId, amount);

        // print(addBalance)
        // if (typeof newBalance )
        //     throw newBalance;


        return response.send({ "user": userId, "balance": newBalance, "deductedAmount": amount });
    } catch (error) {

        return response.status(400).send({ message: error });
    }
}

module.exports = { createWallet, getUserWallet, postDeductBalance, postAddBalance }