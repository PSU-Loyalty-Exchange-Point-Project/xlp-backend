module.exports = (sequelize, DataTypes) => {
    const OTPCode = sequelize.define(
    "OTPCode",
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        code: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.ENUM(
                'valid', // Default value
                'invalid', // If OTP was re-sent and it wasn't consumed
                'consumed', 
                'expired' // If status was valid and time expired it is changed to
                ),
            defaultValue: 'valid',
            allowNull: false
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    return OTPCode;
};