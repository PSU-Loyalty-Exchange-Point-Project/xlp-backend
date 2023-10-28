const chai = require('chai');
const expect = chai.expect;

// Mocking the Transaction model and its rawAttributes
const Transaction = {
    rawAttributes: {
        id: {
            type: {
                key: 'UUID'
            }
        },
        amount: {
            type: {
                key: 'FLOAT'
            }
        },
        type: {
            type: {
                key: 'ENUM',
                values: ['deduct', 'gain', 'fail']
            }
        },
        note: {
            type: {
                key: 'TEXT'
            }
        }
    },
    create: async (data) => {
        return data;
    }
};

describe('Transaction Model', () => {
    it('should have an id field of type UUID', () => {
        expect(Transaction.rawAttributes.id.type.key).to.eql('UUID');
    });

    it('should have an amount field of type FLOAT', () => {
        expect(Transaction.rawAttributes.amount.type.key).to.eql('FLOAT');
    });

    it('should have a type field of type ENUM', () => {
        expect(Transaction.rawAttributes.type.type.key).to.eql('ENUM');
        expect(Transaction.rawAttributes.type.type.values).to.eql(['deduct', 'gain', 'fail']);
    });

    it('should have a note field of type TEXT', () => {
        expect(Transaction.rawAttributes.note.type.key).to.eql('TEXT');
    });

    it('should create a new transaction', async () => {
        const transaction = await Transaction.create({
            id: '5321e241-4c0b-45a4-b8ec-9b52f283455e',
            amount: 100.5,
            type: 'gain',
            note: 'Test transaction'
        });
        expect(transaction.id).to.eql('5321e241-4c0b-45a4-b8ec-9b52f283455e');
        expect(transaction.amount).to.eql(100.5);
        expect(transaction.type).to.eql('gain');
        expect(transaction.note).to.eql('Test transaction');
    });
});
