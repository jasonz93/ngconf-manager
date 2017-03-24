/**
 * Created by zhangsihao on 17-3-24.
 */
angular.module('ngconfManagerApp')
  .service('Projects', function ($http) {
    this.list = function () {
      return $http.get('/api/v1/projects').then((res) => {
        return res.data;
      });
    }
  });
