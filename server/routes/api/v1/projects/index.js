/**
 * Created by zhangsihao on 17-3-24.
 */
const Router = require('koa-router');
const router = new Router();
const path = require('path');

module.exports = router;

router.get('/', async function (ctx) {
  try {
    let result = await ctx.etcd.get(path.join('/', ctx.config.namespace));
    let projects = [];
    result.node.nodes.forEach((node) => {
      projects.push({
        name: node.key.substr(path.join('/', ctx.config.namespace, '/').length)
      })
    });
    ctx.body = projects;
  } catch (e) {
    if (e.errorCode === 100) {
      ctx.body = [];
    } else throw e;
  }
});
