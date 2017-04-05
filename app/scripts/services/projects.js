/**
 * Created by zhangsihao on 17-3-24.
 */
angular.module('ngconfManagerApp')
  .service('Projects', function ($http) {
    this.list = function () {
      return $http.get('/api/v1/projects').then((res) => {
        return res.data;
      });
    };

    this.getProfiles = function (projectName) {
      return $http.get('/api/v1/projects/' + projectName).then((res) => {
        return res.data;
      })
    };

    this.getVersions = function (projectName, profileName) {
      return $http.get('/api/v1/projects/' + projectName + '/' + profileName + '/versions').then(function (res) {
        return res.data;
      })
    };

    this.loadDir = function (projectName, profileName, version, path) {
      if (path.indexOf('/') !== 0) {
        path = '/' + path;
      }
      return $http.get('/api/v1/projects/' + projectName + '/' + profileName + '/versions/' + version + '/root' + path).then(function (res) {
        return res.data;
      })
    }
  });
