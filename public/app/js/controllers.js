"use strict";

/* Controllers */

var controllers = angular.module("splattrApp.controllers", []);

  controllers.controller("RootSplattrController", [ "$http", "$scope", "Bugs", "Github", "Transifex", function( $http, $scope, Bugs, Github, Transifex ) {
    // This controller will collect metadata about transifex & bugs overall (all components)
    $scope.overallBugCount = Bugs.overallBugCount.query();
    $scope.suiteCommitsCount = Github.suiteCommitsCount.query();
    $scope.suiteContributorsCount = Github.suiteContributorsCount.query();
    $scope.suiteReleasesCount = Github.suiteReleasesCount.query();
    $scope.languages = Transifex.languages.query();
    $http({method: 'GET', url: '/transifex/listOfContributors'})
      .success(function(data, status, headers, config) {
    $scope.contributors = data;
    })
  }])
  .controller("BugSplattrController", [ "$scope", "Bugs", "Github", function( $scope, Bugs, Github ) {
    // Use custom service to query data from the server (see services.js)
    // NOTE: $routeParams isn't used in this controller.  If you need access to it,
    //       add it to the declaration like in `BugCompSplatterController`
    $scope.bugs = Bugs.componentCounts.query();
    $scope.github = Github.componentSummaries.query();
  }])
  .controller("BugDetailSplattrController", [ "$scope", "$routeParams", "Bugs", "Github", function( $scope, $routeParams, Bugs, Github ) {
    // Use custom service to query data from the server (see services.js)
    $scope.bug = Bugs.singleBugDetails.get({ id: $routeParams.id });
  }])
  .controller("TransifexSplattrController",  [ "$scope", "Transifex", function( $scope, Transifex ) {
    // Use custom service to query data from the server (see services.js)
    $scope.transifex = $scope.transifex || {};

    // NOTE: $routeParams isn't used in this controller.  If you need access to it,
    //       add it to the declaration like in `BugCompSplatterController`
    $scope.transifex.languages = Transifex.languages.query();
  }])
  .controller("statsAllComponents",  [ "$scope", "$routeParams", "Transifex", function( $scope, $routeParams, Transifex ) {
    $scope.locale = $routeParams.locale;
    $scope.transifex = Transifex.statsAllComponents.get({ locale: $routeParams.locale });
    $scope.transifexDetails = Transifex.transAppService.get({ locale: $routeParams.locale });
  }])
  .controller("statLangComponent",  [ "$scope", "$routeParams", "Transifex", function( $scope, $routeParams, Transifex ) {
    $scope.locale = $routeParams.locale;
    $scope.component = $routeParams.component;
    $scope.transifex = Transifex.statLangComponent.get({
      locale: $routeParams.locale,
      component: $routeParams.component
    });
  }])
  .controller("BugCompSplattrController", [ "$scope", "$routeParams", "Bugs", "Github", function( $scope, $routeParams, Bugs, Github ) {
    // Use custom service to query data from the server (see services.js)
    $scope.component = $routeParams.component;
    $scope.bugs = Bugs.openBugsByComponent.get({ component: $routeParams.component });
  }])
  .controller("GitHubContributorController", [ "$scope", "$routeParams", "Github", function( $scope, $routeParams, Github ) {
    $scope.contributors = Github.suiteContributors.query();
    $scope.componentTags = Github.componentTags.query();
    if ( "repo" in $routeParams ) {
      $scope.repo = $routeParams.repo;
      $scope.repoTags = Github.repoTags.get({ repo: $routeParams.repo });
    }
    if ( "contributor" in $routeParams )
      $scope.contributor = Github.suiteContributor.get({ login: $routeParams.contributor });
  }]);
