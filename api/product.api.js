const multer = require('multer');
const fs = require('fs');
const env = require('../const_env');
const ObjectSchema = require('../models/products.model');
var Utils = require('../Utils');

module.exports = {
  uploadImage(app) {
    let _date = new Date();
    const _rootFolder = env.ROOT_IMAGES;
    if (!fs.existsSync(_rootFolder)) {
      fs.mkdirSync(_rootFolder);
    }
    const upload = multer({ dest: _rootFolder });
    app.post(`/uploads-${env.db_collection.products}`, upload.single('images'), (req, res) => {
      Utils.checkToken(req.query.accessToken).then((dataToken) => {
        if (dataToken.errorMessage) {
          res.send({
            total: 0,
            data: [],
            errorName: dataToken.errorName,
            errorMessage: dataToken.errorMessage
          });
          return;
        }

        if (!Utils.checkForbidden('put', dataToken.role, `/${env.db_collection.products}`)) {
          res.send({
            total: 0,
            data: [],
            errorName: '403',
            errorMessage: 'Account can not access system by function'
          });
          return;
        }

        if (req.body.productId) {
          const processedFile = req.file || {};
          const fullPathInServer = processedFile.path;
          let orgName = processedFile.originalname || '';
          const newFullPath = `${_rootFolder}\\${req.body.productId}_${orgName}`;
          fs.renameSync(fullPathInServer, newFullPath);
          let query = { image: newFullPath };
          ObjectSchema.update({ _id: req.body.productId }, { $set: { ...query } }).exec((err, data) => {
            if (err) {
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
        } else {
          res.send({
            total: 0,
            data: [],
            errorName: '402',
            errorMessage: 'Data wrong!',
          });
        }
      });
    });
  }

}