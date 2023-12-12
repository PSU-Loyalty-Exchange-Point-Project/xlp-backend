const { Model, DataTypes } = require("sequelize");
const sequelize = require('./init');

class Partner extends Model {

}

Partner.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize
});

module.exports = Partner;