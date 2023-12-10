const { Model, DataTypes } = require("sequelize");
const sequelize = require('./init');


class Reward extends Model {

}
Reward.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    }
}, {
    sequelize
});

module.exports = Reward;