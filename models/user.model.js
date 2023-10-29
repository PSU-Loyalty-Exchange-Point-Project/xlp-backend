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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            set(value) {
                try {
                    this.setDataValue('email', value.toLowerCase());
                } catch (error) {
                    console.error(error);
                }
            },
            validate: {
                isEmail: {
                    msg: "Must be a valid email address",
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                try {
                    let hash = bcrypt.hashSync(value.toString(), saltRounds);
                    this.setDataValue('password', hash.toString());
                } catch (error) {
                    console.error(error);
                }
            }
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
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