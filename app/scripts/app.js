'use strict';

/**
 * @ngdoc overview
 * @name ngconfManagerApp
 * @description
 * # ngconfManagerApp
 *
 * Main module of the application.
 */
angular
  .module('ngconfManagerApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMaterial'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .controller('MenuCtrl', function () {
      
  })
  .controller('FileListCtrl', function () {

  })
