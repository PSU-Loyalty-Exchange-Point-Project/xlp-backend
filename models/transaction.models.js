const { DataTypes } = require("sequelize");
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define(
    "Transaction",
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                isInt: true,
                min: 0,
            }
        },
        type: {
            type: DataTypes.ENUM(
                'deduct', 
                'gain', 
                'fail'
                ),
            defaultValue: 'inactive',
            allowNull: false
        },
        note: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    });

    return Transaction;
};