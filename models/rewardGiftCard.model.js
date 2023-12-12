const { Model, DataTypes } = require("sequelize");
const sequelize = require('./init');
const { Reward } = require('./index');


class RewardGiftCard extends Model {
    async redeem() {
        this.status = "consumed";
        await this.save();
    }
}
  

RewardGiftCard.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM(
            'valid', // Default value
            'invalid', // If the rewards was deactivated
            'consumed',     
            'expired'
        ),
        defaultValue: 'valid',
        allowNull: false
    }
}, {
    sequelize,
    include: [ Reward ]
});

module.exports = RewardGiftCard;