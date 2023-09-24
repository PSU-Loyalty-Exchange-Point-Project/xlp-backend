const request = require('supertest');
const app = require('../path_to_your_main_app_file'); // Adjust the path to your main app file
const sequelizeMock = require('sequelize-mock');
const dbMock = new sequelizeMock();

// Mocking the User model
const UserMock = dbMock.define('User', {
  email: 'test@example.com',
  password: 'password123'
});

describe('Login Functionality', () => {

  it('should display a login button on the homepage', async () => {
    const res = await request(app).get('/');
    expect(res.text).toContain('Log In');
  });

  it('should present a login form when clicking on the "Log In" button', async () => {
    const res = await request(app).get('/login');
    expect(res.text).toContain('Email Address');
    expect(res.text).toContain('Password');
    // Add checks for Phone Number and OTP if you have those fields
  });

  it('should validate email and password fields', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        email: 'invalidEmail',
        password: ''
      });
    expect(res.statusCode).toEqual(400);
    expect(res.text).toContain('Invalid email address');
  });

  it('should allow users to log in with valid credentials', async () => {
    UserMock.findOne.mockResolvedValueOnce({
      email: 'test@example.com',
      password: 'password123'
    });

    const res = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('User Dashboard');
  });

  it('should have a "Forgot Password" link', async () => {
    const res = await request(app).get('/login');
    expect(res.text).toContain('Forgot Password');
  });


});

