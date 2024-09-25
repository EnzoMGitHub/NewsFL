const jwt = require('jsonwebtoken');
const data = require('../important.json')
const signature = data.secret
const User = require('../models/schema')

const requireAuth = (req,res,next) => {

    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, signature, (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/login');
            } else {
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
}

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
      jwt.verify(token, signature, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
          try {
            let user = await User.findById(decodedToken.id);
            res.locals.user = user;            
            next();
          } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
      }
    });
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports = { requireAuth, checkUser };