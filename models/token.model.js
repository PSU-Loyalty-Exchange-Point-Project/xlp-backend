const { Model, DataTypes } = require("sequelize");
const sequelize = require('./init');
const { User } = require('./index');
const UserClass = require('./user.model');
var postmark = require("postmark");

var client = new postmark.ServerClient(process.env.POSTMARK_SERVER_CLIENT_SECRET);

class Token extends Model {
    async sendToken() {
        let user = await UserClass.findOne({ where: { id: this.UserId } });

        let uid = btoa(user.id);

        let email = await client.sendEmail({
            "From": "xpl-noreply@kuthbanhosting.com",
            "To": user.email,
            "Subject": `Verify Email Address for XLP`,
            "HtmlBody": `<strong>Hello ${user.name},</strong><br>
                        Click on the following link to activate your account:
                        <a href="${process.env.FRONT_END_ADDRESS}/account/activate/${uid}/${this.id}">
                            ${process.env.FRONT_END_ADDRESS}/account/activate/${uid}/${this.id}
                        </a>`,
            "TextBody": `Hello ${user.name}, \n
            Click on the following link to activate your account:
            ${process.env.FRONT_END_ADDRESS}/account/activate/${uid}/${this.id}`,
            "MessageStream": "outbound"
        });        
    }
    setInvalidStatus() {
        this.status = "invalid";
        this.save();
    }
    consumeToken() {
        this.status = 'consumed';
        this.save()
    }
    setExpiredStatus() {
        this.status = "expired";
        this.save();
    }
}
Token.init({
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    status: {
        type: DataTypes.ENUM(
            'valid', // Default value
            'invalid', 
            'consumed',
            'expired' // If status was valid and time expired it is changed to
        ),
        defaultValue: 'valid',
        allowNull: false
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize,
    include: [ User ]
});

Token.beforeCreate(function(token) { 
    let expireDate = new Date(new Date().getTime() + (30 * 60 * 1000));
        
    token.expiresAt = expireDate;
 });

module.exports = Token;