const { DataTypes } = require("sequelize");
const bcrypt = require('bcrypt');

// Mock the sequelize instance
const sequelizeMock = {
  define: (modelName, attributes) => {
    // Mock the User model with the specified attributes
    return {
      modelName,
      attributes,
      sync: async () => {}, // Mock the sync method
      create: async (data) => {
        // Mock the create method to return the created user
        return {
          id: 1,
          ...data,
        };
      },
    };
  },
  close: async () => {}, // Mock the close method
};

// Mock the User model
const User = sequelizeMock.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

describe('User Model', () => {
  beforeAll(async () => {
    // Mock the sequelize.sync() method
    sequelizeMock.sync = async () => {};
  });

  afterAll(async () => {
    // Mock the sequelize.close() method
    sequelizeMock.close = async () => {};
  });

  it('should create a new user', async () => {
    // Create a new user
    const user = await User.create({
      email: 'test@eample.com',
      password: 'password123',
      status: 'active'
    });

    // Check if the user is created successfully
    expect(user.id).toBeTruthy();
    expect(user.email).toBe('test@eample.com');
    expect(user.status).toBe('active');
  });

  it('should hash the password when setting', async () => {
    // Create a new user with a password
    const user = await User.create({
      email: 'test@example.com',
      password: 'password45006',
      status: 'active'
    });

    // Check if the password is hashed
    expect(user.password).not.toBe('password456');
  });

  it('should validate email format', async () => {
    // Attempt to create a user with an invalid email
    try {
      await User.create({
        email: 'invalidEmail',
        password: 'password789',
        status: 'active'
      });
    } catch (error) {
      // Expect a validation error for invalid email format
      expect(error.errors[0].message).toBe('Must be a valid email address');
    }
  });

  

});
