const mongoose = require('mongoose');
const env = require('./const_env');
const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = {
  connect() {
    mongoose.connect(env.url_db, { useNewUrlParser: true, useUnifiedTopology: true });
  },

  setupDatabase() {
    var MongoClient = require('mongodb').MongoClient;
    var url = env.url;
    var url_db = env.url_db;
    var db_name = env.db_name;

    // create database
    MongoClient.connect(url_db, function (err, db) {
      if (err) throw err;
      console.log("Database created!");
      db.close();
    });

    // create all collections
    Object.keys(env.db_collection).forEach(e => {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db(db_name);
        dbo.createCollection(env.db_collection[e], function (err, res) {
          if (!err) {
            console.log(`Collection ${env.db_collection[e]} created!`);
            db.close();
          }
        });
      });
    });
    this.connect();
    let userSchema = require('./models/users.model');
    userSchema.create({
      email: 'hatdaunho@gmail.com',
      password: '123456a@',
      name: 'HatDauNho',
      phone: '0123456789',
      role: 'admin'
    });
  },

  setupFolder() {
    if (!fs.existsSync(env.ROOT_IMAGES)) {
      fs.mkdirSync(env.ROOT_IMAGES)
    }
  },

  createToken(obj) {
    let token = jwt.sign(
      {
        account: obj.account,
        role: obj.role,
        companyId: obj.companyId,
        time: Date.now()
      },
      env.PRIVATE_KEY,
      {
        algorithm: 'HS256'
      }
    );
    return token;
  },

  async checkToken(token) {
    if (!token) {
      return {
        errorName: '403',
        errorMessage: 'Required accessToken'
      };
    }
    let _userToken = jwt.decode(token);

    var userSchema = require('./models/users.model');
    this.connect();
    var data = await userSchema.findOne({ account: _userToken.account, role: _userToken.role });
    if (!data) {
      return {
        errorName: '404',
        errorMessage: 'Account not exist'
      };
    }
    var _now = new Date();
    if (_now.getTime() - _userToken.time > env.EXPIRY_TOKEN) {
      return {
        errorName: '498',
        errorMessage: 'Token expired'
      };
    }
    return {
      _id: data._id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      role: data.role,
    };
  },

  checkForbidden(method, role, link) {
    var _result = env.FORBIDDEN[method][role].find(e => e === link);
    if (!_result) {
      return true;
    }

    return false;
  },

  getTotal(app, objectSchema, link) {
    app.get(link, (req, res) => {
      this.checkToken(req.query.accessToken).then((dataToken) => {
        if (dataToken.errorMessage) {
          res.send({
            total: 0,
            data: [],
            errorName: dataToken.errorName,
            errorMessage: dataToken.errorMessage
          });
          return;
        }
        this.connect();
        var query = req.query;
        delete query['accessToken'];
        if (query['$sort']) {
          let _temp_sort = query['$sort'].trim().substring(1, query['$sort'].trim().length - 1);
          let _arr_sort = _temp_sort.split(':');
          _sort = {};
          _sort[_arr_sort[0].trim()] = parseInt(_arr_sort[1].trim())
          delete query['$sort'];
        }
        if (query['$regex']) {
          let regex_arr = JSON.parse(query['$regex']);
          regex_arr.forEach((e) => {
            query[e.name] = {
              $regex: e.value,
              $options: e['$options']
            }
          });
          delete query['$regex'];
        }
        objectSchema.count({ ...query }).then((data) => {
          res.send({
            total: data
          });
        });
      });
    });
  },

  get(app, objectSchema, link) {
    app.get(link, (req, res) => {
      this.checkToken(req.query.accessToken).then((dataToken) => {
        if (dataToken.errorMessage) {
          res.send({
            total: 0,
            data: [],
            errorName: dataToken.errorName,
            errorMessage: dataToken.errorMessage
          });
          return;
        }

        if (!this.checkForbidden('get', dataToken.role, link)) {
          res.send({
            total: 0,
            data: [],
            errorName: '403',
            errorMessage: 'Account can not access system by function'
          });
          return;
        }

        this.connect();
        var query = req.query;
        var _skip = env.skip;
        var _limit = env.limit;
        var _sort = { ...env.sort };
        delete query.accessToken;
        if (query['$skip']) {
          _skip = parseInt(query['$skip']);
          delete query['$skip'];
        }
        if (query['$limit']) {
          _limit = parseInt(query['$limit']);
          delete query['$limit'];
        }
        if (query['$in']) {
          let _in_temp = JSON.parse(query['$in']);
          query[_in_temp.name] = { '$in': _in_temp.value };
          delete query['$in'];
        }
        if (query['$sort']) {
          let _temp_sort = query['$sort'].trim().substring(1, query['$sort'].trim().length - 1);
          let _arr_sort = _temp_sort.split(':');
          _sort = {};
          _sort[_arr_sort[0].trim()] = parseInt(_arr_sort[1].trim())
          delete query['$sort'];
        }
        if (query['$regex']) {
          let regex_arr = JSON.parse(query['$regex']);
          regex_arr.forEach((e) => {
            query[e.name] = {
              $regex: e.value,
              $options: e['$options']
            }
          });
          delete query['$regex'];
        }
        objectSchema.find(query).skip(_skip).limit(_limit).sort({ ..._sort }).then((data) => {
          res.send({
            total: data.length,
            data: data
          });
        })
      });
    });
  },

  post(app, objectSchema, link) {
    app.post(link, (req, res) => {
      this.checkToken(req.query.accessToken).then((dataToken) => {
        if (dataToken.errorMessage) {
          res.send({
            total: 0,
            data: [],
            errorName: dataToken.errorName,
            errorMessage: dataToken.errorMessage
          });
          return;
        }

        if (!this.checkForbidden('post', dataToken.role, link)) {
          res.send({
            total: 0,
            data: [],
            errorName: '403',
            errorMessage: 'Account can not access system by function'
          });
          return;
        }

        this.connect();
        var query = req.body;
        delete query.accessToken;
        objectSchema.create(query)
          .then((data) => {
            if (data) {
              res.send({
                total: data.length ? data.length : 1,
                data: [data]
              });
            }
          })
          .catch((err) => {
            if (err.result && err.result.ok) {
              res.send({
                total: 1,
                data: []
              });
              return;
            }
            res.send({
              total: 0,
              data: [],
              errorMessage: 'Create item false'
            });
          });
      });
    });
  },

  put(app, objectSchema, link) {
    app.put(link, (req, res) => {
      this.checkToken(req.query.accessToken).then((dataToken) => {
        if (dataToken.errorMessage) {
          res.send({
            total: 0,
            data: [],
            errorName: dataToken.errorName,
            errorMessage: dataToken.errorMessage
          });
          return;
        }

        if (!this.checkForbidden('put', dataToken.role, link)) {
          res.send({
            total: 0,
            data: [],
            errorName: '403',
            errorMessage: 'Account can not access system by function'
          });
          return;
        }

        var id = req.body._id;
        if (!id) {
          res.send({
            total: 0,
            data: [],
            errorMessage: 'Id not found'
          });
          return;
        }
        this.connect();
        var query = req.body;
        delete query.accessToken;
        delete query._id;
        var date = new Date();
        query.updatedAt = date.toLocaleString();
        objectSchema.update({ _id: id }, { $set: { ...query } }).exec((err, data) => {
          if (err) {
            if (err.result && err.result.ok) {
              res.send({
                total: 1,
                data: []
              });
              return;
            }
            res.send({
              total: 0,
              data: [],
              errorName: err.name,
              errorMessage: err.message
            });
            return;
          }

          res.send({
            total: data.length ? data.length : 1,
            data: [data]
          });
        });
      });
    });
  },

  delete(app, objectSchema, link) {
    app.delete(link, (req, res) => {
      this.checkToken(req.query.accessToken).then((dataToken) => {
        if (dataToken.errorMessage) {
          res.send({
            total: 0,
            data: [],
            errorName: dataToken.errorName,
            errorMessage: dataToken.errorMessage
          });
          return;
        }

        if (!this.checkForbidden('delete', dataToken.role, link)) {
          res.send({
            total: 0,
            data: [],
            errorName: '403',
            errorMessage: 'Account can not access system by function'
          });
          return;
        }

        var id = req.query._id;
        if (!id) {
          res.send({
            total: 0,
            data: [],
            errorMessage: 'Id not found'
          });
          return;
        }

        this.connect();
        objectSchema.remove({ _id: id })
          .exec()
          .then((data) => {
            res.send({
              total: 1,
              data: [data]
            });
          })
          .catch((err) => {
            if (err.result && err.result.ok) {
              res.send({
                total: 1,
                data: []
              });
              return;
            }
            res.send({
              total: 0,
              data: [],
              errorMessage: 'Id not found'
            });
          })
      });
    });
  }

}