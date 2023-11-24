const { Model, DataTypes } = require("sequelize");
const sequelize = require('./init');
const { User } = require('./index');

class Wallet extends Model {
    getBalance() {
        return this.balance;
    }

    deposit(amount) {
        this.balance += amount;
        this.save();
    }   
    withdraw(amount) {
        this.balance -= amount;
        this.save();
    }
}

Wallet.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isInt: true,
            min: 0,
        }
    }
}, {
    sequelize
});

module.exports = Wallet;