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

router.get('/:project', async function (ctx) {
  try {
    let projectKey = path.join('/', ctx.config.namespace, ctx.params.project);
    let result = await ctx.etcd.get(projectKey);
    let nodes = result.node.nodes;
    let profiles = [];
    for (let i = 0; i < nodes.length; i ++) {
      let profileName = nodes[i].key.substr(projectKey.length + 1);
      let profileKey = path.join(projectKey, profileName);
      profiles.push({
        name: profileName,
        currentVersion: Number((await ctx.etcd.get(path.join(profileKey, 'version'))).node.value)
      });
    }
    ctx.body = profiles;
  } catch (e) {
    throw e;
  }
});

router.get('/:project/:profile/versions', async function (ctx) {
  let projectKey = path.join('/', ctx.config.namespace, ctx.params.project);
  let profileName = ctx.params.profile;
  let profileKey = path.join(projectKey, profileName);
  let versions = [];
  let versionsKey = path.join(profileKey, 'versions');
  let versionNodes = (await ctx.etcd.get(versionsKey)).node.nodes;
  versionNodes.forEach((node) => {
    versions.push(Number(node.key.substr(versionsKey.length + 1)));
  });
  ctx.body = versions;
});

router.get('/:project/:profile/versions/:version/root:path(.*)', async function (ctx) {
  let rootKey = path.join('/', ctx.config.namespace, ctx.params.project, ctx.params.profile, 'versions', ctx.params.version, ctx.params.path);
  let nodes = (await ctx.etcd.get(rootKey)).node.nodes;
  let dirs = [];
  let files = [];
  nodes.forEach((node) => {
    let nameParts = node.key.split('/');
    let name = nameParts[nameParts.length - 1];
    if (node.dir) {
      dirs.push({
        name: name
      })
    } else {
      files.push({
        name: name
      })
    }
  });
  ctx.body = {
    dirs: dirs,
    files: files
  };
});
