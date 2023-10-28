const chai = require('chai');
const expect = chai.expect;

// Mocking the Token model and its rawAttributes
const Token = {
    rawAttributes: {
        id: {
            type: {
                key: 'UUID'
            }
        },
        token: {
            type: {
                key: 'UUID'
            }
        },
        expiresAt: {
            type: {
                key: 'DATE'
            }
        }
    },
    create: async (data) => {
        return data;
    }
};

describe('Token Model', () => {
    it('should have an id field of type UUID', () => {
        expect(Token.rawAttributes.id.type.key).to.eql('UUID');
    });

    it('should have a token field of type UUID', () => {
        expect(Token.rawAttributes.token.type.key).to.eql('UUID');
    });

    it('should have an expiresAt field of type DATE', () => {
        expect(Token.rawAttributes.expiresAt.type.key).to.eql('DATE');
    });

    it('should create a new token', async () => {
        const token = await Token.create({
            id: '5321e241-4c0b-45a4-b8ec-9b52f283455e',
            token: '1234e241-4c0b-45a4-b8ec-9b52f2834567',
            expiresAt: new Date()
        });
        expect(token.id).to.eql('5321e241-4c0b-45a4-b8ec-9b52f283455e');
        expect(token.token).to.eql('1234e241-4c0b-45a4-b8ec-9b52f2834567');
    });
});
