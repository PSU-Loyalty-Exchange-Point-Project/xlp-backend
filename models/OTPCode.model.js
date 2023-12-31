const { Model, DataTypes } = require("sequelize");
const sequelize = require('./init');
const { User } = require('./index');
const UserClass = require('./user.model');

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

class OTPCode extends Model {
    static generateOTPCode() {
        var OTPStr = "";
        for (let i = 0; i < parseInt(process.env.OTP_LENGTH); i++) {
            let number = Math.floor(Math.random() * 10);
            OTPStr += number;
        }
        return OTPStr;
    }

    async sendOTP() {
        let user = await UserClass.findOne({ where: { id: this.UserId } });

        client.messages
            .create({
                body: `Hi ${user.name},\nYour XLP code is: ${this.code}`,
                from: 'whatsapp:+14155238886',
                to: `whatsapp:+${user.phoneNumber}`
            })
            .then(message => console.log(message.sid));
    }

    consumeOTP() {
        this.status = 'consumed';
        this.save()
    }

}
OTPCode.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    code: {
        allowNull: true,
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
        allowNull: true,
    }
}, {
    sequelize,
    include: [ User ]
});

OTPCode.beforeCreate(async (otpEntry, options) => {
    otpEntry.code = OTPCode.generateOTPCode();
    otpEntry.expiresAt = new Date(new Date().getTime() + (process.env.OTP_MINUTES_TO_EXPIRE * 60 * 1000));
  });

module.exports = OTPCode;