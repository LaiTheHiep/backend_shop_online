const Utils = require("./Utils");
const env = require('./const_env');
const express = require('express');
const port = env.port;
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();

// Use Node.js body parsing middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// int folder store images
// Utils.setupFolder();

// init database
// Utils.setupDatabase();

// api
const user = require('./models/users.model');
const user_link = `/${env.db_collection.users}`;
const user_api = require('./api/user.api');
user_api.authentication(app, '/authentication');
user_api.register(app, '/register');
user_api.get(app);
Utils.post(app, user, user_link);
Utils.put(app, user, user_link);
Utils.delete(app, user, user_link);
Utils.getTotal(app, user, `${user_link}-total`);

const brand = require('./models/brands.model');
const brand_link = `/${env.db_collection.brands}`;
Utils.get(app, brand, brand_link);
Utils.post(app, brand, brand_link);
Utils.put(app, brand, brand_link);
Utils.delete(app, brand, brand_link);
Utils.getTotal(app, brand, `${brand_link}-total`);

const category = require('./models/categories.model');
const category_link = `/${env.db_collection.categories}`;
Utils.get(app, category, category_link);
Utils.post(app, category, category_link);
Utils.put(app, category, category_link);
Utils.delete(app, category, category_link);
Utils.getTotal(app, category, `${category_link}-total`);

const feedback = require('./models/feedbacks.model');
const feedback_link = `/${env.db_collection.feedbacks}`;
Utils.get(app, feedback, feedback_link);
Utils.post(app, feedback, feedback_link);
Utils.put(app, feedback, feedback_link);
Utils.delete(app, feedback, feedback_link);
Utils.getTotal(app, feedback, `${feedback_link}-total`);

const type = require('./models/types.model');
const type_link = `/${env.db_collection.types}`;
Utils.get(app, type, type_link);
Utils.post(app, type, type_link);
Utils.put(app, type, type_link);
Utils.delete(app, type, type_link);
Utils.getTotal(app, type, `${type_link}-total`);

const product = require('./models/products.model');
const product_link = `/${env.db_collection.products}`;
Utils.get(app, product, product_link);
Utils.post(app, product, product_link);
Utils.put(app, product, product_link);
Utils.delete(app, product, product_link);
Utils.getTotal(app, product, `${product_link}-total`);
// upload images
const product_api = require('./api/product.api');
product_api.uploadImage(app);

const checkout = require('./models/checkout.model');
const checkout_link = `/${env.db_collection.checkouts}`;
Utils.get(app, checkout, checkout_link);
Utils.post(app, checkout, checkout_link);
Utils.put(app, checkout, checkout_link);
Utils.delete(app, checkout, checkout_link);

// Start the server
const server = app.listen(port, (error) => {
  if (error) {
    throw error;
  }
  console.log('Server running...')
});

