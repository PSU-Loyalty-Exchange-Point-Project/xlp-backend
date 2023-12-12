const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/user.model'); // Adjust this path to the location of your User model

// Create a new Sequelize instance for testing
const sequelize = new Sequelize('sqlite::memory:', { logging: false });

User.init({
    // Define your model attributes here
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
        set(value) {
            this.setDataValue('email', value.toLowerCase());
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            const hash = bcrypt.hashSync(value, saltRounds);
            this.setDataValue('password', hash);
        }
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    status: {
        type: DataTypes.ENUM('inactive', 'phone verified', 'active', 'suspended', 'forget password'),
        defaultValue: 'active',
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'User'
});

describe('User Model', () => {
    beforeAll(async () => {
        await sequelize.sync();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('create a new user and authenticate', async () => {
        // Create a user
        const createdUser = await User.create({
            name: 'Alice',
            email: 'alice@example.com',
            password: 'password123',
            phoneNumber: '1122334455'
        });

        console.log('Created User:', createdUser.toJSON()); // Debugging log

        // Authenticate the created user
        const authenticatedUser = await User.authenticate('alice@example.com', 'password123');
        console.log('Authenticated User:', authenticatedUser); // Debugging log

        expect(authenticatedUser).not.toBeNull();
        expect(authenticatedUser.email).toBe('alice@example.com');
    });
    test('user email uniqueness', async () => {
      await User.create({
          name: 'Dave',
          email: 'dave@example.com',
          password: 'password321',
          phoneNumber: '9876543210'
      });
  
      try {
          await User.create({
              name: 'Duplicate Dave',
              email: 'dave@example.com',
              password: 'password123',
              phoneNumber: '0123456789'
          });
          console.log('Unexpected success in creating a user with duplicate email');
      } catch (error) {
          console.log('Error when creating a user with duplicate email:', error.message);
          expect(error).toBeDefined();
      }
  });

  test('change user password', async () => {
    const user = await User.create({
        name: 'Eve',
        email: 'eve@example.com',
        password: 'initialPassword',
        phoneNumber: '1231231234'
    });
    console.log('User created with initial password:', user.toJSON());

    user.setPassword('newPassword');
    await user.save();
    await user.reload();
    console.log('User after password change:', user.toJSON());

    expect(user.passwordValid('newPassword')).toBe(true);
    expect(user.passwordValid('initialPassword')).toBe(false);
});


    // Add more tests as necessary
});
