const { Sequelize, DataTypes } = require('sequelize');

// Define the Wallet model directly in the test file
class Wallet extends Sequelize.Model {
    getBalance() {
        return this.balance;
    }

    deposit(amount) {
        this.balance += amount;
        return this.save();
    }

    withdraw(amount) {
        this.balance -= amount;
        return this.save();
    }
}

// Initialize the Wallet model
Wallet.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
    },
    balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isInt: true,
            min: 0,
        },
    },
}, { sequelize: new Sequelize('sqlite::memory:', { logging: false }), modelName: 'Wallet' });

describe('Wallet Model', () => {

    beforeAll(async () => {
        // Sync the model with the in-memory database
        await Wallet.sequelize.sync();
    });

    afterAll(async () => {
        // Close the connection to the in-memory database
        await Wallet.sequelize.close();
    });

    test('initial balance is 0', async () => {
        const wallet = await Wallet.create({});
        expect(wallet.getBalance()).toBe(0);
    });

    test('deposit increases balance', async () => {
        const wallet = await Wallet.create({});
        await wallet.deposit(100);
        expect(wallet.getBalance()).toBe(100);
    });

    test('withdraw decreases balance', async () => {
        const wallet = await Wallet.create({ balance: 100 });
        await wallet.withdraw(50);
        expect(wallet.getBalance()).toBe(50);
    });

});
