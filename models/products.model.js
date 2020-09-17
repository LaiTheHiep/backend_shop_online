const mongoose = require('mongoose');
const env = require('../const_env');

const productSchema = mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: { type: String },
  information: { type: String },
  cost: { type: Number, required: true },
  rate: { type: Number },
  discount: { type: Number },
  categoryId: { type: String, required: true },
  typeId: { type: String, required: true },
  brandId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 1000
  }
});

module.exports = mongoose.model(env.db_collection.products, productSchema);