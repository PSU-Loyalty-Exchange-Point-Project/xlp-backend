const { User, Token } = require('../models');

const  createEmailVerificationToken = async (request, response) =>  {
    // DELETE
    try {
        var user = await User.findOne({ where: {id: request.body.userId} });    
        var token = await Token.create({expiresAt: new Date()});
    
        user.addToken(token);
        response.send({success: true, route: request.originalUrl});
    } catch (error) {
        response.status(400).send(error.details);
    }
};