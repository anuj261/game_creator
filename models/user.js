const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
  email: { type: String, unique: true},
  first_name: { type: String, default: '' },
  last_name: { type: String, default: '' },
  user_name: { type: String, unique: true},
  country: { type: String },
  phone: { type: String },
  password: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('User', schema);
