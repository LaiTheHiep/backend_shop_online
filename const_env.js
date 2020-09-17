// mongo
const url = 'mongodb://localhost:27017/';
const db_name = 'shop_online';
const url_db = url + db_name;

exports.url = url;
exports.db_name = db_name;
exports.url_db = url_db;

// collection name
exports.db_collection = {
  users: 'users',
  categories: 'categories',
  types: 'types',
  brands: 'brands',
  products: 'products',
  feedbacks: 'feedbacks'
};

// limit get list data
const skip = 0;
const limit = 200;
const sort = { createdAt: -1 };

exports.skip = skip;
exports.limit = limit;
exports.sort = sort;