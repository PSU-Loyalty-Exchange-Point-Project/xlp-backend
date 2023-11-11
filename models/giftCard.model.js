const { Model, DataTypes } = require("sequelize");
const sequelize = require('./init');
const allCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

class GiftCard extends Model {
    static generateGiftCardNumber() {
        var giftCardNumber = "";

        for (let i = 0; i < 12; i++) {
            const randomIndex = Math.floor(Math.random() * allCharacters.length);
            giftCardNumber += allCharacters[randomIndex];
        }
        return giftCardNumber;
    }

    redeem() {
        this.status = "consumed";
        this.save();
    }
}
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
    value: { // Value in LP
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
        type: DataTypes.ENUM(
            'valid', // Default value
            'invalid', // If OTP was re-sent and it wasn't consumed
            'consumed',
            'expired' // If status was valid and time expired it is changed to
        ),
        defaultValue: 'valid',
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize
});

GiftCard.beforeValidate(function(giftCard) { 
    let expireDate = new Date(new Date().getTime() + 31536000000); // 1 Year from the time of creation
    
    giftCard.number = GiftCard.generateGiftCardNumber();
    giftCard.expiresAt = expireDate;
 });
 
module.exports = GiftCard;