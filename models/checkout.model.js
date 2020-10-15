const mongoose = require('mongoose');
const env = require('../const_env');

const checkoutSchema = mongoose.Schema({
  userId: { type: String, required: true },
  products: { type: Object },
  resolve: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model(env.db_collection.checkouts, checkoutSchema);