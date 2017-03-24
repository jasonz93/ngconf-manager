/**
 * Created by zhangsihao on 17-3-24.
 */
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const klaw = require('klaw');
const path = require('path');
const _ = require('lodash');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const serve = require('koa-static');
const Etcd = require('etcd-cli');

const config = {
  etcd: 'http://127.0.0.1:2379',
  namespace: 'ngconf'
};
app.context.config = config;
app.context.etcd = new Etcd.V2HTTPClient(app.context.config.etcd);

const router = require('./routes');

app.use(serve(path.join(__dirname, '..', 'app')));

function registerRoutes(router, dirPath) {
  return fs.readdirAsync(dirPath).then((files) => {
    let promises = [];
    files.forEach((file) => {
      promises.push(fs.statAsync(path.join(dirPath, file)).then((stat) => {
        if (stat.isDirectory()) {
          return fs.accessAsync(path.join(dirPath, file, 'index.js'), fs.F_OK).then(() => {
            let route = './' + path.join(path.relative(__dirname, dirPath), file);
            return nextRouter = require(route);
          }).catch((err) => {
            return new Router();
          }).then((nextRouter) => {
            return registerRoutes(nextRouter, path.join(dirPath, file)).then(() => {
              router.use('/' + file, nextRouter.routes(), nextRouter.allowedMethods());
            });
          })
        }
      }))
    });
    return Promise.all(promises);
  })
}

registerRoutes(router, './routes').then(() => {
  app.use(router.routes());
  app.use(router.allowedMethods());
  app.listen(3000);
});

