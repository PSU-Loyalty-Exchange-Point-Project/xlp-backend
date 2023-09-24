const bcrypt = require('bcrypt');
const { User } = require('../models');


const getCreateUser = (request, response) =>  {
    

    response.send({success: true, route: request.originalUrl})
};

const  getAllUsers = async (request, response) =>  {
    // DELETE
    let users = await User.findAll();
    response.send({success: true, route: request.originalUrl, users: users})
};

const postCreateUser = (request, response) =>  {
    User.create(
        {email: request.body.email, password: request.body.password}
        ).catch((error) => {
            console.error(error);
            response.status(400)
        });
    response.send({success: true})
};

const verifyEmail = (email, token) =>  {
    let user = User.findOne(
        { 
            where: {email: email} 
        }).then((data) => {
            console.log(data);
            return data;
        }).catch((error) => {
            return error;
        });
};

let checkPassword = (password, passwordHash) => {
    
    try {
        let hash = bcrypt.compareSync(password.toString(), passwordHash);
        return hash;
    } catch (error) {
        console.error(error);
    }
};

module.exports = {getCreateUser, postCreateUser, getAllUsers, checkPassword, verifyEmail};

