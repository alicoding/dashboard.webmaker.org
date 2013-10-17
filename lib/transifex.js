const BASE_URL = 'https://www.transifex.com/api/2/project/';

var request = require('request'),
    env = require("./config.js"),
    authHeader = 'Basic ' + new Buffer(env.get("TRANSIFEX-AUTH")).toString('base64'),
    projectUrl = BASE_URL + env.get("TRANSIFEX-PROJECT");

// Language API url for Transifex
var languagesAPIUrl = projectUrl + '/languages/';

// request the project details based on the url provided
function projectRequest (url, callback) {
  request.get({
    url: url,
    headers: {'Authorization': authHeader}
  }, function(error, response, body) {
    if (error) {
      callback(error);
    }
    if (response.statusCode !== 200) {
      callback(null, Error(url + " returned " + response.statusCode));
    }
    callback(null, body);
  });
};

// return the number of contributors in each role and the total number
function getNumberOfContributors( callback ) {
  var contributorsDetails = {};
  var numOfTranslators = 0;
  var numOfReviewers = 0;
  var numOfCoordinators = 0;
  var totalNum = 0;

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
    contributorsDetails.totalContributors = numOfTranslators + numOfReviewers + numOfCoordinators;
    contributorsDetails.Translators = numOfTranslators;
    contributorsDetails.Reviewers = numOfReviewers;
    contributorsDetails.Coordinators = numOfCoordinators;
    callback( null, contributorsDetails );
  });
};

module.exports.numberOfContributors = getNumberOfContributors;
