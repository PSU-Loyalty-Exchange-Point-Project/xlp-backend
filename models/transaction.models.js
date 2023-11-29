const { Model, DataTypes } = require("sequelize");
const sequelize = require('./init');


class Transaction extends Model {

}

Transaction.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        }
    },
    type: {
        type: DataTypes.ENUM(
            'withdraw',
            'deposit',
            'fail'
        ),
        defaultValue: 'fail',
        allowNull: false
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize
});
module.exports = Transaction;