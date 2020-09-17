// mongo
const url = 'mongodb://localhost:27017/';
const db_name = 'shop_online';
const url_db = url + db_name;

exports.url = url;
exports.db_name = db_name;
exports.url_db = url_db;

exports.ROOT_IMAGES = 'C:\\shop_online'; // folder store images

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

const PRIVATE_KEY = 'Hat Dau Nho - Manchester United';
exports.PRIVATE_KEY = PRIVATE_KEY;

const EXPIRY_TOKEN = 86400000; // 1day (milliseconds)
exports.EXPIRY_TOKEN = EXPIRY_TOKEN;

exports.FORBIDDEN = {
  get: {
    admin: [],
    user: []
  },
  post: {
    admin: [],
    user: []
  },
  put: {
    admin: [],
    user: []
  },
  delete: {
    admin: [],
    user: []
  }
}