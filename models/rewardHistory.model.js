const { Model, DataTypes } = require("sequelize");
const sequelize = require('./init');
const { Reward, User } = require('./index');

class RewardHistory extends Model {

}

RewardHistory.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    }
}, {
    sequelize,
    include: [ Reward, User ]
});