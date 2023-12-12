const { Sequelize, DataTypes } = require('sequelize');
const postmark = require('postmark');

// Create a mock for Postmark's sendEmail method
const mockSendEmail = jest.fn().mockResolvedValue(true);

// Mock the entire Postmark ServerClient
jest.mock('postmark', () => ({
  ServerClient: jest.fn().mockImplementation(() => ({
    sendEmail: mockSendEmail,
  })),
}));

class Token extends Sequelize.Model {
    async sendToken() {
        // Use the mocked Postmark client
        const client = new postmark.ServerClient("POSTMARK_API_KEY"); // Replace with actual API key in real implementation
        await client.sendEmail({
            "From": "sender@example.com",
            "To": "receiver@example.com",
            "Subject": "Token",
            "HtmlBody": "<strong>Your token</strong>",
            "TextBody": "Your token",
        });
    }

    setInvalidStatus() {
        this.status = 'invalid';
        return this.save();
    }

    consumeToken() {
        this.status = 'consumed';
        return this.save();
    }

    setExpiredStatus() {
        this.status = 'expired';
        return this.save();
    }
}

Token.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
    },
    status: {
        type: DataTypes.ENUM('valid', 'invalid', 'consumed', 'expired'),
        defaultValue: 'valid',
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: () => new Date(new Date().getTime() + (30 * 60 * 1000)) // 30 minutes from now
    }
}, { sequelize: new Sequelize('sqlite::memory:', { logging: false }), modelName: 'Token' });

describe('Token Model Tests', () => {

    beforeAll(async () => {
        await Token.sequelize.sync();
    });

    test('initial status is valid', async () => {
        const token = await Token.create({});
        expect(token.status).toBe('valid');
    });

    test('sendToken sends an email', async () => {
        const token = await Token.create({});
        await token.sendToken();
        // Check if Postmark's sendEmail mock function was called
        expect(mockSendEmail).toHaveBeenCalled();
    });

    test('setInvalidStatus updates status to invalid', async () => {
        const token = await Token.create({});
        await token.setInvalidStatus();
        expect(token.status).toBe('invalid');
    });

    test('consumeToken updates status to consumed', async () => {
        const token = await Token.create({});
        await token.consumeToken();
        expect(token.status).toBe('consumed');
    });

    test('setExpiredStatus updates status to expired', async () => {
        const token = await Token.create({});
        await token.setExpiredStatus();
        expect(token.status).toBe('expired');
    });

    afterAll(async () => {
        await Token.sequelize.close();
    });
});
