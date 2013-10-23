'use strict';

/* Services */

var splattrAppServices = angular.module('splattrApp.services', [ 'ngResource' ])
  .value('version', '0.1');

// These can declared as dependancies to be injected in any controller
splattrAppServices.factory('Bugs', ['$resource', function($resource){
  return {
    componentCounts: $resource('/bugzilla/components/counts', {}, {
      query: {
        method: 'GET',
        params: {},
        isArray: true
      }
    }),
    openBugsByComponent: $resource( "/bugzilla/component/:component/open", {}, {
      query: {
        method: "GET",
        params: { component: "webmaker.org" }
      },
      get: {
        method: "GET",
        params: {},
        isArray: true
      }
    }),
    overallBugCount: $resource( "/bugzilla/suite/count", {}, {
      query: {
        method: "GET",
        params: {},
        isArray: false
      }
    }),
    singleBugDetails: $resource( "/bugzilla/bug/:id", {}, {
      query: {
        method: "GET",
        params: { id: "0" }
      }
    })
  };
}]);

splattrAppServices.factory('Github', ['$resource', function($resource){
  return {
    componentSummaries: $resource('/github/components/summaries', {}, {
      query: {
        method: 'GET',
        params: {},
        isArray: true
      }
    }),
    suiteCommitsCount: $resource('/github/suite/commits/count', {}, {
      query: {
        method: 'GET',
        params: {},
        isArray: false
      }
    }),
    suiteContributor: $resource('/github/suite/contributor/:login', {}, {
      get: {
        method: "GET",
        params: { id: "RickEyre" }
      }
    }),
    suiteContributors: $resource('/github/suite/contributors', {}, {
      query: {
        method: 'GET',
        params: {},
        isArray: true
      }
    }),
    suiteContributorsCount: $resource('/github/suite/contributors/count', {}, {
      query: {
        method: 'GET',
        params: {},
        isArray: false
      }
    }),
    suiteReleasesCount: $resource('/github/suite/releases/count', {}, {
      query: {
        method: 'GET',
        params: {},
        isArray: false
      }
    }),
    componentTags: $resource('/github/components/tags/counts', {}, {
      query: {
        method: 'GET',
        params: {},
        isArray: true
      }
    }),
    repoTags: $resource('/github/repo/:repo/tags', {}, {
      get: {
        method: "GET",
        params: { repo: "webmaker.org" },
        isArray: true
      }
    }),
  };
}]);

splattrAppServices.factory('Transifex', ['$resource', function($resource){
  return {
    listOfContributors: $resource('/transifex/listOfContributors', {}, {
      query: {
        method: 'GET',
        params: {},
        isArray: true
      }
    }),
    languages: $resource('/transifex/languages', {}, {
      query: {
        method: 'GET',
        params: {},
        isArray: true
      }
    })
  };
}]);
