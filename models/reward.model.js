const { Model, DataTypes } = require("sequelize");
const sequelize = require('./init');
const { Partner } = require('./index');

class Reward extends Model {

}

Reward.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    include: [ Partner ]
});


class RewardGiftCard extends Reward {

}
  

RewardGiftCard.init({
    number: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize
});


class RewardDiscountCode extends Reward {

}
  

RewardDiscountCode.init({
    code: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize
});