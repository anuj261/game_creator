const mongoose = require('mongoose');
const crypto = require('crypto');

require('../models/user');

const User = mongoose.model('User');

const utility = require('../lib/utils');


function validateBody(req, res, next) {
  const validate = utility.validateParams(req.body, ['email', 'password']);
  if (validate) {
    return res.status(validate.status).json({ error: validate.error })
  }
  next();
}

function signin(req, res) {
  let { email, password } = req.body;

  password = crypto.pbkdf2Sync(password, global.config.encryption_key, 1000, 64, `sha512`).toString(`hex`);

  const q = {
    email,
    password
  };

  const options = {
    lean: true
  }

  User.findOne(q, '', options, (err, doc) => {
    if (err) {
      console.log(`error while fetching user ${err || err.stack}`);
      return res.status(400).json({ error: 'something went wrong, please try again later' });
    }
    if (!doc) {
      console.log(`user not found for ${email}`);
      return res.status(400).json({ error: 'invalid email or password' });
    }
    res.status(200).json({ result: 'Logged in successfully!' ,user_name:doc["user_name"]});
  })
}

module.exports = {
  validateBody,
  signin
}