const { request, response } = require('express');
const { Wallet } = require('../models');
const { createTransaction, recomputeWallet } = require('./transaction.controller');


const createWallet = async (userObject) =>  {
    try {
        let wallet = await Wallet.create();
        wallet.setUser(userObject);

        // wallet.save
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

const deductBalance = async (userId, amount) => {
    let originalBalance;
    let wallet = await Wallet.findOne({ where: { UserId: userId } });
    try {
        
        if (!wallet)
            throw "Wallet does not exist"

        originalBalance = wallet.balance;

        if (!Number.isInteger(amount))
            throw "Number must be an integer";

        wallet.withdraw(amount);
        
        if (wallet.balance == originalBalance)
            throw "Deposit was not processed correctly";


        // await createTransaction(amount, "deduct", null, wallet);

        // recomputeWallet(wallet.id);

        return {success: true};    
    } catch (error) {
        console.error(error);
        // await createTransaction(amount, "fail", error, wallet);
    
        return {success: false, error: error};
    }
}

const addBalance = async (userId, amount, note=null) => {
    let originalBalance;
    let wallet = await Wallet.findOne({ where: { UserId: userId } });
    try {
        
        if (!wallet)
            throw "Wallet does not exist";


        originalBalance = wallet.balance;

        if (!Number.isInteger(amount))
            throw "Number must be an integer";

        wallet.deposit(amount);
        
        if (wallet.balance == originalBalance)
            throw "Deposit was not processed correctly";

        await createTransaction(
            amount,
            "deposit",
            note,
            wallet.id
        );

        // recomputeWallet(wallet.id);

        return {success: true};    
    } catch (error) {
        console.error(error);
        // await createTransaction(amount, "fail", error, wallet);
        return {success: false, error: error};
    }
}

const getUserWallet = async (request, response) => {
    try {
        let { userId } = request.query;
        
        let wallet = await Wallet.findOne({ where: { UserId: userId } });

        if (!wallet)
            throw "Wallet no found";

        return response.send({ "useId": userId, "wallet": { "balance": wallet.getBalance() }});
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
        
        let addBalanceFunction = await addBalance(userId, amount);
        
        if (!addBalanceFunction.success)
            throw addBalanceFunction.error;


        return response.send(addBalanceFunction);
    } catch (error) {
        console.error(error)
        return response.status(400).send({ message: error });
    }
}

module.exports = { createWallet, getUserWallet, postDeductBalance, postAddBalance, addBalance }