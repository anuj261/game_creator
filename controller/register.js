const mongoose = require('mongoose');
const crypto = require('crypto');

require('../models/user');

const User = mongoose.model('User');

const utility = require('../lib/utils');


function validateBody(req, res, next) {
  const validate = utility.validateParams(req.body, ['email', 'first_name', 'last_name', 'password']);
  if (validate) {
    return res.status(validate.status).json({ error: validate.error })
  }
  next();
}

function signup(req, res, next) {
  const body = req.body;
  let { password } = body;

  body.password = crypto.pbkdf2Sync(password, global.config.encryption_key, 1000, 64, `sha512`).toString(`hex`);

  User.create(body, (err, doc) => {
    if (err) {
      
      console.log(`error while creating user ${err || err.stack}`);
      if(err.code==11000){
        return res.status(400).json({ error: 'Duplicate User' });
      }
      return res.status(400).json({ error: 'something went wrong, please try again later' });
    }
    res.status(200).json({ result: 'User registered successfully' });
  });
}

module.exports = {
  validateBody,
  signup
}