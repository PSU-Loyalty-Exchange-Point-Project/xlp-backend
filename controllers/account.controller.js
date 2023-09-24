const bcrypt = require('bcrypt');
const { User } = require('../models');



const postLogin = async (request, response) => {
    const { username, password } = req.body;

    if(!username || !password){ 
        return response.status(400).send('Request missing username or password param')
    }
    
    try {
        //let user = await User.authenticate(username, password)
    
        //return res.json(user);
      } catch (err) {
        return res.status(400).send('invalid username or password');
      }
}

module.exports = { postLogin };