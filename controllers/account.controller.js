const bcrypt = require('bcrypt');
const { User } = require('../models');

// const getRegister = (request, response) =>  {
    

//   response.send({success: true, route: request.originalUrl})
// };

const  getAllUsers = async (request, response) =>  {
  // DELETE
  let users = await User.findAll();
  response.send({success: true, route: request.originalUrl, users: users})
};

const postRegister = async (request, response) =>  {
  var user = await User.create(
      {email: request.body.email, password: request.body.password}
      ).catch((error) => {
          console.error(error);
          response.status(400)
      });

  response.send({user: {id: user.id, email: request.body.email}})
};

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



module.exports = {getAllUsers, postRegister, postLogin, checkPassword, verifyEmail};