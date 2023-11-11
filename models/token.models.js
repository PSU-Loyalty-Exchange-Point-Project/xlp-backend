const { Model, DataTypes } = require("sequelize");
const sequelize = require('./init');
const { User } = require('./index');

class Token extends Model {
    constructor(userObject) {
        super();

        let expireDate = new Date(new Date().getTime() + (30 * 60 * 1000));
        
        this.expiresAt = expireDate;
        this.UserId = userObject.id;

        return this;
    }
}
Token.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    include: [ User ]
});

module.exports = Token;