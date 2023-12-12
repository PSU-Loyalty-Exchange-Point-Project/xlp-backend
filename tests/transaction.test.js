const { Sequelize, DataTypes } = require('sequelize');
const Transaction = require('../models/transaction.models'); 

// Create a new Sequelize instance for testing
const sequelize = new Sequelize('sqlite::memory:', { logging: false });

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
        type: DataTypes.ENUM('withdraw', 'deposit', 'fail'),
        defaultValue: 'fail',
        allowNull: false
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Transaction'
});

describe('Transaction Model', () => {
    beforeAll(async () => {
        await sequelize.sync();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('create a new transaction', async () => {
        const transaction = await Transaction.create({
            amount: 100,
            type: 'deposit',
            note: 'Test deposit'
        });

        console.log('Created Transaction:', transaction.toJSON());

        expect(transaction).toBeDefined();
        expect(transaction.amount).toBe(100);
        expect(transaction.type).toBe('deposit');
    });

    test('transaction type validation', async () => {
        try {
            await Transaction.create({
                amount: 50,
                type: 'invalid_type',
                note: 'Invalid type transaction'
            });
        } catch (error) {
            console.log('Error when creating a transaction with an invalid type:', error.message);
            expect(error).toBeDefined();
        }
    });

});
