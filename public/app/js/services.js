'use strict';

/* Services */

var splattrAppServices = angular.module('splattrApp.services', [ 'ngResource' ])
  .value('version', '0.1');

// These can declared as dependancies to be injected in any controller
splattrAppServices.factory('Bugs', ['$resource',
  function($resource){
    return $resource('/bugzilla/components/counts', {}, {
      query: {
        method:'GET',
        params: {},
        isArray: true
      }
    });
  }]);

splattrAppServices.factory('Github', ['$resource',
  function($resource){
    return $resource('/github/components/summaries', {}, {
      query: {
        method:'GET',
        params: {},
        isArray: true
      }
    });
  }]);

splattrAppServices.factory('Transifex', ['$resource',
  function($resource){
    return $resource('/transifex/listOfContributors', {}, {
      query: {
        method:'GET',
        params: {},
        isArray: true
      }
    });
  }]);

