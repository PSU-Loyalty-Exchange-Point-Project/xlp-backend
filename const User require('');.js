const User = require(''); 


const getLogin = (req, res) => {
    res.render('login');
};


const postLogin = (req, res, next) => {
    User.login();
    res.redirect('/');
};


const getLogout = (req, res) => {
    req.logout();
    res.redirect('/');
};


const getRegister = (req, res) => {
    // Render the register view with a message
    res.render('register');
};

const postRegister = async (req, res) => {
    User.Register(username, email, passwor)
    res.redirect('/');
};

const getUserProfile = (req, res) => {
    res.render('profile');
};

const postUserProfile = async (req, res) => {
    User.updateProfile();
};
 
module.exports = {
    getLogin,
    postLogin,
    getLogout,
    getRegister,
    postRegister,
    getUserProfile,
    postUserProfile,
};
