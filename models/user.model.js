const { Model, DataTypes, Sequelize } = require("sequelize");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const sequelize = require('./init');

class User extends Model {
    setActivatedStatus() {
        this.status = 'active';
        this.save();
    }
    
    setPhoneVerifiedStatus() {
        this.status = 'phone verified';
        this.save();
    }
    
    setSuspendedStatus() {
        this.status = 'suspended';
        this.save();
    }

    setForgetPasswordStatus() {
        this.status = 'forget password';
        this.save();
    }

    passwordValid(password) {
        // Checks password entered by the user against the
        // password hash stored in the user object.

        return bcrypt.compareSync(
            password.toString(), // Entered password
            this.password.toString()); // Stored password
    }

    setPassword(newPassword) {
        try {
            this.password = newPassword;
            this.save();
            return true;
        }
        catch (error) {
            console.error(error)
            return false;
        }
    }

    getUID() {
        return (btoa(this.id));
    }

    obscuredPhoneNumber(){
        const obscuredPart = '*'.repeat(this.phoneNumber.length - 4);
        const visiblePart = this.phoneNumber.slice(-4);

        return obscuredPart + visiblePart;
    }

    static async authenticate(email, password) {
        try {
            let user = await User.findOne({ where: { email: email, status: 'active' } }); 

            if (!user) 
                throw "User does not exist"
            
            if (!user.passwordValid(password)) 
                throw "Incorrect password" 
            
            return user;
        }
        catch (error) {
            console.error(error)
            return null;
        }
    }
}
User.init({
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
            'phone verified',
            'active',
            'suspended',
            'forget password'
        ),
        defaultValue: 'inactive',
        allowNull: false
    }
}, { sequelize });

module.exports = User;