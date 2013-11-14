"use strict";

/* Controllers */

var controllers = angular.module("splattrApp.controllers", []);

  controllers.controller("RootSplattrController", [ "$routeParams", "$http", "$scope",
    function( $routeParams, $http, $scope ) {

    $http({method: 'GET', url: '/bugzilla/suite/count'})
      .success(function(data, status, headers, config) {
      $scope.overallBugCount = data;
    });

    $http({method: 'GET', url: '/github/suite/commits/count'})
      .success(function(data, status, headers, config) {
      $scope.suiteCommitsCount = data;
    });

    $http({method: 'GET', url: '/github/suite/contributors/count'})
      .success(function(data, status, headers, config) {
      $scope.suiteContributorsCount = data;
    });

    $http({method: 'GET', url: '/github/suite/releases/count'})
      .success(function(data, status, headers, config) {
      $scope.suiteReleasesCount = data;
    });

    $http({method: 'GET', url: '/transifex/languages'})
      .success(function(data, status, headers, config) {
      $scope.languages = data;
    });

    $http({method: 'GET', url: '/transifex/listOfContributors'})
      .success(function(data, status, headers, config) {
      $scope.contributors = data;
    });

  }])
  .controller("BugSplattrController", [ "$http", "$scope",
    function( $http, $scope ) {

    $http({method: 'GET', url: '/bugzilla/components/counts'})
      .success(function(data, status, headers, config) {
      $scope.bugs = data;
    });

    $http({method: 'GET', url: '/github/components/summaries'})
      .success(function(data, status, headers, config) {
      $scope.github = data;
    });

  }])
  .controller("BugDetailSplattrController", [ "$http", "$scope", "$routeParams",
    function( $http, $scope, $routeParams ) {

    $http({method: 'GET', url: '/bugzilla/bug/' + $routeParams.id})
      .success(function(data, status, headers, config) {
      $scope.bug = data;
    });

  }])
  .controller("statsAllComponents",  [ "$http", "$scope", "$routeParams",
    function( $http, $scope, $routeParams ) {
    $scope.locale = $routeParams.locale;

    $http({method: 'GET', url: '/transifex/components/' + $scope.locale + '/stats'})
      .success(function(data, status, headers, config) {
      $scope.transifex = data;
    });

    $http({method: 'GET', url: '/transifex/components/' + $scope.locale + '/details'})
      .success(function(data, status, headers, config) {
      $scope.transifexDetails = data;
    });

  }])
  .controller("statLangComponent",  [ "$http", "$scope", "$routeParams",
    function( $http, $scope, $routeParams ) {
    $scope.locale = $routeParams.locale;
    $scope.component = $routeParams.component;

    $http({method: 'GET', url: '/transifex/' + $scope.component + '/' + $scope.locale + '/stats'})
      .success(function(data, status, headers, config) {
      $scope.stats = data;
    });

  }])
  .controller("BugCompSplattrController", [ "$http", "$scope", "$routeParams",
    function( $http, $scope, $routeParams ) {

    $scope.component = $routeParams.component;

    $http({method: 'GET', url: '/bugzilla/component/' + $scope.component + '/open'})
      .success(function(data, status, headers, config) {
      $scope.bugs = data;
    });

  }])
  .controller("GitHubContributorController", [ "$http", "$scope", "$routeParams",
    function( $http, $scope, $routeParams ) {

    $http({method: 'GET', url: '/github/suite/contributors'})
      .success(function(data, status, headers, config) {
      $scope.contributors = data;
    });

    $http({method: 'GET', url: '/github/components/tags/counts'})
      .success(function(data, status, headers, config) {
      $scope.componentTags = data;
    });

    if ( "repo" in $routeParams ) {
      $scope.repo = $routeParams.repo;

      $http({method: 'GET', url: '/github/repo/' + $scope.repo + '/tags'})
        .success(function(data, status, headers, config) {
        $scope.repoTags = data;
      });

    }

    if ( "contributor" in $routeParams ) {
      $http({method: 'GET', url: '/github/suite/contributor/' + $routeParams.contributor})
        .success(function(data, status, headers, config) {
        $scope.contributor = data;
      });
    }

  }]);
