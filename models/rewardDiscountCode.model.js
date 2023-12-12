const { Model, DataTypes } = require("sequelize");
const sequelize = require('./init');
const { Reward } = require('./index');


class RewardDiscountCode extends Model {

}
  

RewardDiscountCode.init({
    code: {
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

module.exports = RewardDiscountCode;