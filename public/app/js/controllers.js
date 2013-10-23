"use strict";

/* Controllers */

var controllers = angular.module("splattrApp.controllers", []);

  controllers.controller("RootSplattrController", [ "$scope", "Bugs", "Github", "Transifex", function( $scope, Bugs, Github, Transifex ) {
    // This controller will collect metadata about transifex & bugs overall (all components)
    $scope.overallBugCount = Bugs.overallBugCount.query();
    $scope.suiteCommitsCount = Github.suiteCommitsCount.query();
    $scope.suiteContributorsCount = Github.suiteContributorsCount.query();
    $scope.suiteReleasesCount = Github.suiteReleasesCount.query();
    $scope.contributions = Transifex.listOfContributors.query();
    $scope.languages = Transifex.languages.query();

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
  .controller("TransifexCompSplattrController",  [ "$scope", "$routeParams", "Transifex", function( $scope, $routeParams, Transifex ) {
    // Use custom service to query data from the server (see services.js)

    // This controller will collect transifex data about a specific component.
    // See "BugCompSlattrController", which uses `services.js` and `controllers.js` in tandem
    // to get the parameter from the route defined in `app.js`
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
