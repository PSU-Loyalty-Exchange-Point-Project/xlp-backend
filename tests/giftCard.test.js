const { Sequelize, DataTypes } = require('sequelize');
const GiftCard = require('../models/giftCard.model'); // Replace with the correct path to your GiftCard model

// Initialize Sequelize with an in-memory SQLite database for testing
const sequelize = new Sequelize('sqlite::memory:', { logging: false });

// Re-define the GiftCard model with the test database
GiftCard.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    number: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
    },
    value: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
            min: 0 
        }
    },
    price: {
        allowNull: false,
        type: DataTypes.FLOAT,
        validate: {
            min: 0 
        }
    },
    status: {
        type: DataTypes.ENUM('valid', 'invalid', 'consumed', 'expired'),
        defaultValue: 'valid',
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, { sequelize, modelName: 'GiftCard' });

describe('GiftCard Model Tests', () => {

    beforeAll(async () => {
        await sequelize.sync();
    });

    test('Gift card number is generated correctly', () => {
        const number = GiftCard.generateGiftCardNumber();
        expect(number).toBeDefined();
        expect(number).toHaveLength(12);
        expect(number).toMatch(/^[A-Z0-9]+$/); // Check if number consists only of allowed characters
    });

    test('New gift card has valid status and expiry set', async () => {
        const giftCardNumber = GiftCard.generateGiftCardNumber();
        const expireDate = new Date(new Date().getTime() + 31536000000); // 1 Year from now

        const giftCard = await GiftCard.create({
            number: giftCardNumber,
            value: 100,
            price: 50,
            expiresAt: expireDate
        });

        expect(giftCard.status).toBe('valid');
        expect(giftCard.expiresAt).toBeDefined();
        expect(giftCard.expiresAt.getTime()).toBeGreaterThan(new Date().getTime());
    });

    test('Redeem changes gift card status to consumed', async () => {
        const giftCardNumber = GiftCard.generateGiftCardNumber();
        const expireDate = new Date(new Date().getTime() + 31536000000); // 1 Year from now

        const giftCard = await GiftCard.create({
            number: giftCardNumber,
            value: 100,
            price: 50,
            expiresAt: expireDate
        });

        giftCard.redeem();
        expect(giftCard.status).toBe('consumed');
    });

    afterAll(async () => {
        await sequelize.close();
    });
});
