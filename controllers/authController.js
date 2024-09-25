const path = require('path');
const user = require('../models/schema')
const jwt = require('jsonwebtoken');
const data = require('../important.json')
const signature = data.secret

const checkErr = (err) => {
    let error = { email: ' ', password: ' '};

    if (err.code === 11000) {
        error.email = "Email already registered"
        return error
    }

    if (err.message === 'Incorrect Email') {
        error.email = 'That email is not registered';
    }

    if (err.message === 'Incorrect Password') {
        error.password = 'That password is incorrect';
    }
    
    if (err.message.includes('user validation failed')) {
        try {
            Object.values(err.erorrs).forEach(({properties}) => {
                error[properties.path] = properties.message;
            });
        } catch (err) {
            console.error('Error processing validation errors:', err);
        }
    }
    

    return error;
};

const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
    return jwt.sign({ id }, signature, {
        expiresIn: maxAge
    })
};

module.exports.signup_get = (req, res) => {
    res.render('signup.ejs');
}
  
module.exports.login_get = (req, res) => {
    res.render('login.ejs');

}
  
module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const login = await user.create({ email, password });
        const token = createToken(login._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge*1000});
        res.status(201).json({user: login._id});
    }
    catch (err) {
        const check = checkErr(err);
        console.log(err);
        res.status(400).json({ check });
    }
}
  
module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const loggedUser = await user.login(email,password);
        const token = createToken(loggedUser._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge*1000});
        res.status(200).json({ user: loggedUser._id});
    } catch (err) {
        const check = checkErr(err);
        res.status(400).json({ check });
    }
}

module.exports.logout_get = (req,res) => {
    res.cookie('jwt','', { maxAge: 1 });
    res.redirect('/');
}