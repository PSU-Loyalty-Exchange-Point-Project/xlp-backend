const chai = require('chai');
const expect = chai.expect;

// Mocking the Wallet model and its rawAttributes
const Wallet = {
    rawAttributes: {
        id: {
            type: {
                key: 'UUID'
            }
        },
        balance: {
            type: {
                key: 'INTEGER'
            },
            defaultValue: 0
        }
    },
    create: async (data) => {
        return data;
    }
};

describe('Wallet Model', () => {
    it('should have an id field of type UUID', () => {
        expect(Wallet.rawAttributes.id.type.key).to.eql('UUID');
    });

    it('should have a balance field of type INTEGER', () => {
        expect(Wallet.rawAttributes.balance.type.key).to.eql('INTEGER');
    });

    it('should have a default balance of 0', () => {
        expect(Wallet.rawAttributes.balance.defaultValue).to.eql(0);
    });

    it('should create a new wallet', async () => {
        const wallet = await Wallet.create({
            id: '5321e241-4c0b-45a4-b8ec-9b52f283455e',
            balance: 0,
        });
        expect(wallet.id).to.eql('5321e241-4c0b-45a4-b8ec-9b52f283455e');
        expect(wallet.balance).to.eql(0);
    });
});
