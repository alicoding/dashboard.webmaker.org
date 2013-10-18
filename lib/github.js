var GitHubAPI = require( "node-github" ),
    moment = require( "moment" ),
    config = require("./config.js"),
    auth = config.get("GITHUB_AUTH");

function createGitHubAPI() {
  var github = new GitHubAPI({
      version: "3.0.0",
      timeout: "5000"
  });
  if (auth) {
    github.authenticate({
      type: "basic",
      username: auth.user,
      password: auth.password
    });
  }
  return github;
}

function getRepoApi() {
  return createGitHubAPI().getReposApi();
}

var components = [
  "webmaker.org",
  "popcorn.webmaker.org",
  "thimble.webmaker.org",
  "goggles.webmaker.org",
  "login.webmaker.org",
  "makeapi",
  "makeapi-client",
  "make-valet",
  "webmaker-suite",
  "webmaker-profile",
  "webmaker-profile-service",
  "webmaker-ui",
  "node-webmaker-i18n",
  "node-webmaker-loginapi",
  "node-webmaker-postalservice"
];

// TODO: These only return the first page of the results. To do this correctly
//       we would have to be able to specify the page as well. We can do this
//       through using the paging API in node-github.

function tags ( repo, callback ) {
  getRepoApi().getTags({
    user: "mozilla",
    repo: repo,
    per_page: 100
  }, callback );
}

function commits( repo, callback ) {
  getRepoApi().getCommits({
    user: "mozilla",
    repo: repo,
    per_page: 100
  }, callback );
}

function tagsFromDate( repo, date, callback ) {
  tags( repo, function( err, tags ) {
    if ( err ) {
      callback( err );
      return;
    }
    commits( repo, function( err, commits ) {
      if ( err ) {
        callback( err );
        return;
      }
      var resTags = [],
          fromDate = moment( date, "YYYY-MM-DD" );
      for ( var i = 0; i < commits.length; i++ ) {
        var commitDate = moment( commits[ i ].commit.committer.date, "YYYY-MM-DD" );
        if ( fromDate.diff( commitDate, "days") > 0 ) {
          break;
        }
        for ( var x = 0; x < tags.length; x++ ) {
          if ( tags[ x ].commit.sha === commits[ i ].sha ) {
            resTags.push( tags[ x ] );
          }
        }
      }
      callback( undefined, resTags );
    });
  });
}

function contributors( repo, callback ) {
  getRepoApi().getContributors({
    user: "mozilla",
    repo: repo,
    per_page: 100
  }, callback );
}

function contributorCounts( index, callback ) {
  if ( index === components.length ) {
    callback( null, {} );
    return;
  }
  contributors( components[ index ], function( err, contributors ) {
    if ( err ) {
      callback( err );
      return;
    }
    contributorCounts( index + 1, function( err, counts ) {
      if ( err ) {
        callback( err );
        return;
      }
      counts[ components[ index ] ] = contributors.length;
      callback( null, counts );
    });
  });
}

module.exports = {
  tags: tags,
  tagsFromDate: tagsFromDate,
  commits: commits,
  contributors: contributors,
  contributorCounts: contributorCounts
};
