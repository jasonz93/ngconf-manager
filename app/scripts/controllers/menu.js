'use strict';
/**
 * Created by zhangsihao on 17-3-24.
 */
angular.module('ngconfManagerApp')
  .controller('MenuCtrl', function ($scope, $mdDialog) {
    $scope.openProject = function (ev) {
      $mdDialog.show({
        controller: OpenProjectCtrl,
        templateUrl: 'views/open_project.tmpl.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true
      }).then(function (answer) {
        //TODO: Refresh
      }).catch((err) => {
      });
    };

    function OpenProjectCtrl ($scope, $mdDialog, Projects) {
      $scope.projects = [];
      Projects.list().then(function (projects) {
        console.log(projects);
        $scope.projects = projects;
      });

      $scope.select = function (project) {

      };

      $scope.cancel = function () {
        $mdDialog.cancel();
      };
    }
  });

