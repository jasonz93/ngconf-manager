/**
 * Created by zhangsihao on 17/3/25.
 */
angular.module('ngconfManagerApp')
  .controller('ProfileListCtrl', function ($scope, Projects) {
    $scope.$on('openProject', function (event, project) {
      console.log('opening', project);
      $scope.project = project;
      $scope.profiles = {};
      $scope.currentPath = '/';
      Projects.getProfiles(project.name).then(function (profiles) {
        $scope.profiles = {};
        for (let i in profiles) {
          $scope.profiles[profiles[i].name] = profiles[i];
        }
        if (profiles[0]) {
          $scope.selectProfile(profiles[0]);
        }
      })
    });

    function watcher(newVal, oldVal) {
      if (newVal && (newVal !== oldVal)) {
        loadDir();
      }
    }

    function loadDir() {
      if ($scope.project && $scope.profile && typeof $scope.currentPath !== 'undefined' && typeof $scope.version !== 'undefined') {
        Projects.loadDir($scope.project.name, $scope.profile.name, $scope.version, $scope.currentPath).then(function (list) {
          $scope.dirs = list.dirs;
          $scope.files = list.files;
        });
      }
    }

    $scope.$watch('currentPath', watcher);
    $scope.$watch('profile', watcher);
    $scope.$watch('version', watcher);
    $scope.$watch('project', watcher);

    $scope.selectProfile = function (profile) {
      $scope.profile = profile;
      $scope.loadVersions(profile.name);
      this.version = profile.currentVersion;
    };

    $scope.loadVersions = function (profileName) {
      Projects.getVersions($scope.project.name, profileName).then(function (versions) {
        if (!$scope.profiles[profileName]) {
          $scope.profiles[profileName] = {};
        }
        $scope.profiles[profileName].versions = versions;
      });
    };

    $scope.selectPrevPath = function () {
      var pathParts = $scope.currentPath.split('/');
      pathParts.pop();
      $scope.currentPath = pathParts.length ? '/' : '' + pathParts.join('/');
    };

    $scope.selectDir = function (dir) {
      $scope.currentPath = $scope.currentPath + '/' + dir.name;
    };

    $scope.selectFile = function (file) {

    };
  });
