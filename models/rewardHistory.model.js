const { Model, DataTypes } = require("sequelize");
const sequelize = require('./init');


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
    sequelize
});

module.exports = RewardHistory;