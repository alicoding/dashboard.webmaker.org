"use strict";

// Declare app level module which depends on filters, and services
var splattrApp = angular.module("splattrApp", [
  "ngRoute",
  "splattrApp.filters",
  "splattrApp.directives",
  "splattrApp.controllers"
]);

// Declare single-page routes
splattrApp.config([ "$routeProvider", function( $routeProvider ) {
  // Root
  $routeProvider.when( "/", { templateUrl: "partials/root.html", controller: "RootSplattrController" } );

  // First-level routes
  $routeProvider.when( "/bugs", { templateUrl: "partials/bugs/components.html", controller: "BugSplattrController" } );
  $routeProvider.when( "/contributors", { templateUrl: "partials/contributors/list.html", controller: "GitHubContributorController"});
  $routeProvider.when( "/tags", { templateUrl: "partials/tags/list.html", controller: "GitHubContributorController"});
  $routeProvider.when( "/trans/contributors", { templateUrl: "partials/transifex/userlist.html", controller: "RootSplattrController"});

  // Second-level routes
  $routeProvider.when( "/bugs/comp/:component", { templateUrl: "partials/bugs/one_comp.html", controller: "BugCompSplattrController" } );
  $routeProvider.when( "/contributors/:contributor", { templateUrl: "partials/contributors/detail.html", controller: "GitHubContributorController"});
  $routeProvider.when( "/trans/component/:component/language/:locale/stats", { templateUrl: "partials/transifex/lang-component-details.html", controller: "statLangComponent"});
  $routeProvider.when( "/trans/components/:locale/stats", { templateUrl: "partials/transifex/lang-details.html", controller: "statsAllComponents" });
  $routeProvider.when( "/trans/languages", { templateUrl: "partials/transifex/languages.html", controller: "RootSplattrController" } );
  $routeProvider.when( "/tags/:repo", { templateUrl: "partials/tags/detail.html", controller: "GitHubContributorController"});

  // Third-level routes
  $routeProvider.when( "/bug/:id", { templateUrl: "partials/bugs/detail.html", controller: "BugDetailSplattrController" } );

  // Catchall, redirects to root
  $routeProvider.otherwise( { redirectTo: "/" } );
}]);
