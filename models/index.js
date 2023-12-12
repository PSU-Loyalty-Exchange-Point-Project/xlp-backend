'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize = require('./init');
const { Transaction } = require('sequelize');
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file !== 'init.js' &&
      file !== 'index.js'
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

function applyExtraSetup(sequelize) {
  const { User, Token, OTPCode, Wallet, Transaction, Partner, Reward, RewardGiftCard, RewardDiscountCode } = sequelize.models;

  User.hasMany(Token);
  Wallet.belongsTo(User);
  Partner.hasMany(Reward);
  Reward.hasMany(RewardGiftCard);
  Reward.hasMany(RewardDiscountCode);
  Wallet.hasMany(Transaction);
  User.hasMany(OTPCode);
}

applyExtraSetup(sequelize);

module.exports = db;