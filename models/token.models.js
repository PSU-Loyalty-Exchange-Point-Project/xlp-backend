const { DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const Token = sequelize.define(
    "Token",
    {
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
    });

    return Token;
};