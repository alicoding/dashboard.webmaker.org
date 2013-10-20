var GitHubAPI = require( "github" ),
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

const DEFAULTS = {
  user: "mozilla",
  per_page: 100,
  page: 0,
  numPages: 0 // Means that all the pages will be retrieved by default
};

function assignDefaultOptions( options ) {
  options = options || {};
  for ( var option in DEFAULTS )
    options[ option ] = options[ option ] || DEFAULTS[ option ];
  return options;
}

function getPages( github, firstPage, count, max, callback ) {
  if ( count && count === max || !github.hasNextPage( firstPage ) )
    return callback( null, [] );

  github.getNextPage( firstPage , function( err, nextPage ) {
    if ( err )
      return callback( err );
    getPages( github, nextPage, count + 1, max, function( err, pages ) {
      if ( err ) {
        return callback( err );
      }
      return callback( null, nextPage.concat( pages ) );
    });
  });
}

function repoQuery( query, options, callback ) {
var github = createGitHubAPI(),
    pageCount = 1;
  github.repos[query]( options, function( err, res ) {
    getPages( github, res, pageCount, options.numPages, function( err, pages ) {
      if ( err )
        return callback( err );
      return callback( null, res.concat( pages ) );
    });
  });
}

function tags ( repo, callback, options ) {
  options = assignDefaultOptions( options );
  options.repo = repo;
  repoQuery( "getTags", options, callback );
}

function commits( repo, callback, options ) {
  options = assignDefaultOptions( options );
  options.repo = repo;
  repoQuery( "getCommits", options, callback );
}

function contributors( repo, callback, options ) {
  options = assignDefaultOptions( options );
  options.numPages = 10;
  options.repo = repo;
  repoQuery( "getContributors", options, callback );
}

function tagsFromDate( repo, date, callback ) {
  tags( repo, function( err, tags ) {
    if ( err )
      return callback( err );

    commits( repo, function( err, commits ) {
      if ( err )
        return callback( err );
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
      return callback( undefined, resTags );
    });
  });
}

function contributorCounts( index, callback ) {
  var component;

  if ( index === components.length )
    return callback( null, [] );

  component = components[ index ];
  contributors( component, function( err, contributors ) {
    if ( err )
      return callback( err );
    contributorCounts( index + 1, function( err, counts ) {
      if ( err )
        return callback( err );
      counts.push({
        component: component,
        count: contributors.length
      });
      callback( null, counts );
    });
  });
}

function commitCounts( index, callback ) {
  if ( index === components.length )
    return callback( null, [] );
  var component = components[ index ];
  commits( component, function( err, commits ) {
    if ( err )
      return callback( err );
    commitCounts( index + 1, function( err, counts ) {
      if ( err )
        return callback( err );
      counts.push({
        component: component,
        count: commits.length
      });
      return callback( null, counts );
    });
  });
}

function summaries( callback ) {
  contributorCounts( 0, function( err, contributorCounts ) {
    if ( err )
      return callback( err );
    commitCounts( 0, function( err, commitCounts ) {
      if ( err )
        return callback( err );
      var summaries = [];
      for ( var i = 0; i < components.length; i++ ) {
        summaries.push({
          component: components[ i ],
          contributorCount: contributorCounts[ i ].count,
          commitCount: commitCounts[ i ].count
        });
      }
      return callback( null, summaries );
    });
  });
}

module.exports = {
  tags: tags,
  tagsFromDate: tagsFromDate,
  commits: commits,
  commitCounts: function( callback ) {
    return commitCounts( 0, callback );
  },
  contributors: contributors,
  contributorCounts: function( callback ) {
    return contributorCounts( 0, callback );
  },
  summaries: summaries
};
