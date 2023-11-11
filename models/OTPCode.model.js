const { Model, DataTypes } = require("sequelize");
const sequelize = require('./init');
const { User } = require('./index');
const UserClass = require('./user.model');

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

class OTPCode extends Model {
    constructor(userObject) {
        super();

        let expireDate = new Date(new Date().getTime() + (process.env.OTP_MINUTES_TO_EXPIRE * 60 * 1000));
        
        this.code = this.generateOTPCode();
        this.expiresAt = expireDate;
        this.UserId = userObject.id;

        return this;
    }

    generateOTPCode() {
        var OTPStr = "";
        for (let i = 0; i < parseInt(process.env.OTP_LENGTH); i++) {
            let number = Math.floor(Math.random() * 10);
            OTPStr += number;
        }
        return OTPStr;
    }

    async sendOTP() {
        console.log("Sending OTP")
        let user = await UserClass.findByPk(this.UserId);

        client.messages
            .create({
                body: `Your XLP code is ${this.code}`,
                from: 'whatsapp:+14155238886',
                to: `whatsapp:+${user.phoneNumber}`
            })
            .then(message => console.log(message.sid));
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
}, {
    sequelize,
    include: [ User ]
});

module.exports = OTPCode;