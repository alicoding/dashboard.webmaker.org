const BASE_URL = 'https://www.transifex.com/api/2/project/';

var request = require("request"),
    env = require("./config.js"),
    _ = require("lodash"),
    authHeader = "Basic " + new Buffer(env.get("TRANSIFEX-AUTH")).toString("base64"),
    projectUrl = BASE_URL + env.get("TRANSIFEX-PROJECT"),
    slugs = [];

// API URLs for Transifex
var languagesAPIUrl = projectUrl + '/languages/',
    languageCodeUrl = BASE_URL + '/language/',
    resourceAPIUrl = projectUrl + '/resources/',
    projectResourceUrl = projectUrl + '/resource/';

// request the project details based on the url provided
function projectRequest (url, callback) {
  request.get({
    url: url,
    headers: {'Authorization': authHeader}
  }, function(error, response, body) {
    if (error) {
      return callback(error);
    }
    if (response.statusCode !== 200) {
      return callback(Error(url + " returned " + response.statusCode));
    }
    callback(null, body);
  });
};

function listOfSlugs(callback) {
  projectRequest(resourceAPIUrl, function(err, projectDetails){
    if (err) {
      return callback(err);
    }
    try {
      projectDetails = JSON.parse(projectDetails);
    } catch (e) {
      return callback(e);
    }
    projectDetails.forEach(function(data) {
      slugs.push(data.slug);
    });
    callback(null, slugs)
  });
};

function projectStats(callback) {
  listOfSlugs(function (error, slugs) {
    if (error) {
      return callback(error);
    }
    var wait = slugs.length,
        finalDetails = {};
    slugs.forEach(function (slug) {
      var details = {},
          url = projectResourceUrl + slug + '/stats/';
      projectRequest(url, function(err, projectDetails){
        if (err) {
          return callback(err);
        }
        try {
          projectDetails = JSON.parse(projectDetails);
          details[slug] = projectDetails;
        } catch (e) {
          return callback(e);
        }
        _.extend(finalDetails, details)
        wait--;
        if ( wait === 0 ) {
          callback(null, finalDetails);
        }
      });
    });
  });
};

// return the number of contributors in each role and the total number
function getNumberOfContributors( callback ) {
  var contributorsDetails = [],
      numOfTranslators = 0,
      numOfReviewers = 0,
      numOfCoordinators = 0,
      totalNum = 0;

  projectRequest(languagesAPIUrl, function(err, projectDetails){
    if (err) {
      return callback(err);
    }
    try {
      projectDetails = JSON.parse(projectDetails);
    } catch (e) {
      return callback(e);
    }
    projectDetails.forEach(function(data) {
      numOfTranslators += data.translators.length;
      numOfReviewers += data.reviewers.length;
      numOfCoordinators += data.coordinators.length;
    });
    contributorsDetails.push({
      "component": "Contributors",
      "count": numOfTranslators + numOfReviewers + numOfCoordinators
    });
    contributorsDetails.push( {
      "component": "Translators",
      "count": numOfTranslators
    });
    contributorsDetails.push( {
      "component": "Reviewers",
      "count": numOfReviewers
    });
    contributorsDetails.push( {
      "component": "Coordinators",
      "count": numOfCoordinators
    });
    callback( null, contributorsDetails );
  });
};

module.exports.numberOfContributors = getNumberOfContributors;
module.exports.projectStats = projectStats;
