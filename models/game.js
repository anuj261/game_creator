const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String },
  allocated_numbers:[Number],
  available_numbers: [Number]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Game', schema);
