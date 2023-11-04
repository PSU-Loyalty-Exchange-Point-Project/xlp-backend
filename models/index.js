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
console.log(__dirname)
fs
  .readdirSync(__dirname)
  .filter(file => {
    // console.log('basename: ' + basename);
    // return (['OTPCode.model.js', 'index.js', 'init.js', 'transaction.models.js', 'wallet.models.js']);
    return (
    //   file.indexOf('.') !== 0 &&
    //   file !== basename &&
      file !== 'init.js' &&
      // file !== 'OTPCode.model.js' &&
      file !== 'index.js' &&
      file !== 'transaction.models.js' &&
      file !== 'wallet.model.js'
    //   file.slice(-3) === '.js' &&
    //   file.indexOf('.test.js') === -1
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
// console.log(db)
function applyExtraSetup(sequelize) {
	const { User, Token, OTPCode } = sequelize.models;

  User.hasMany(Token);
  User.hasMany(OTPCode);
//   Wallet.belongsTo(User);
//   Wallet.hasMany(Transaction);
}

applyExtraSetup(sequelize)

// console.log('4')
module.exports = db;
