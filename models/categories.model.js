const mongoose = require('mongoose');
const env = require('../const_env');

const categorySchema = mongoose.Schema({
  name: { type: String, required: true },
  description: {type: String},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model(env.db_collection.categories, categorySchema);