const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
  user_name:{ type: String },
  game_id: { type: String }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Ticket', schema);
