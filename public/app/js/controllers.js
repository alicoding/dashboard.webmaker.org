'use strict';

/* Controllers */

var controllers = angular.module('splattrApp.controllers', [])
  .controller('BugSplattrController', [ '$scope', "Bugs", function( $scope, Bugs ) {
    // Use custom service to query data from the server (see services.js)
    $scope.bugs = Bugs.componentCounts.query();
  }])
  .controller('GitSplattrController',  [ '$scope', "Github", function( $scope, Github ) {
    // Use custom service to query data from the server (see services.js)
    $scope.github = Github.componentSummaries.query();
  }])
  .controller('TransifexSplattrController',  [ '$scope', "Transifex", function( $scope, Transifex ) {
    // Use custom service to query data from the server (see services.js)
    $scope.contributions = Transifex.listOfContributors.query();
    $scope.languages = Transifex.languages.query();
  }]);