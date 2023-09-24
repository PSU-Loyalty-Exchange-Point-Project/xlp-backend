const { DataTypes } = require("sequelize");
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
    "User",
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: "Must be a valid email address",
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            set(value) {
                try {
                    let hash = bcrypt.hashSync(value.toString(), saltRounds);
                    this.setDataValue('password', hash.toString());
                } catch (error) {
                    console.error(error);
                }
            }
        },
        status: {
            type: DataTypes.ENUM(
                'inactive', 
                'active', 
                'suspended', 
                'forgetPassword'
                ),
            defaultValue: 'inactive',
            allowNull: false
        }
    });

    return User;
};