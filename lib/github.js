var GitHubAPI = require( "github" ),
    moment = require( "moment" ),
    config = require("./config.js"),
    auth = config.get("GITHUB_AUTH"),
    components = require("./utils").repos;

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

function getPages( github, page, count, max, callback ) {
  if ( count && count === max || !github.hasNextPage( page ) )
    return callback( null, [] );

  github.getNextPage( page , function( err, nextPage ) {
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
  github.repos[query]( options, function( err, firstPage ) {
    getPages( github, firstPage, pageCount, options.numPages, function( err, pages ) {
      if ( err )
        return callback( err );
      return callback( null, firstPage.concat( pages ) );
    });
  });
}

function getTags( repo, callback, options ) {
  options = assignDefaultOptions( options );
  options.repo = repo;
  repoQuery( "getTags", options, callback );
}

function getCommits( repo, callback, options ) {
  options = assignDefaultOptions( options );
  options.repo = repo;
  repoQuery( "getCommits", options, callback );
}

function getContributors( repo, callback, options ) {
  options = assignDefaultOptions( options );
  options.numPages = 10;
  options.repo = repo;
  repoQuery( "getContributors", options, callback );
}

function getTagsFromDate( repo, date, callback ) {
  getTags( repo, function( err, tags ) {
    if ( err )
      return callback( err );

    getCommits( repo, function( err, commits ) {
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

function getContributorCounts( index, callback ) {
  var component;

  if ( index === components.length )
    return callback( null, [] );

  component = components[ index ];
  getContributors( component, function( err, contributors ) {
    if ( err )
      return callback( err );
    getContributorCounts( index + 1, function( err, counts ) {
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

function getCommitCounts( index, callback ) {
  if ( index === components.length )
    return callback( null, [] );
  var component = components[ index ];
  getCommits( component, function( err, commits ) {
    if ( err )
      return callback( err );
    getCommitCounts( index + 1, function( err, counts ) {
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

function getSummaries( callback ) {
  getContributorCounts( 0, function( err, contributorCounts ) {
    if ( err )
      return callback( err );
    getCommitCounts( 0, function( err, commitCounts ) {
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
  tags: getTags,
  tagsFromDate: getTagsFromDate,
  commits: getCommits,
  commitCounts: function( callback ) {
    return getCommitCounts( 0, callback );
  },
  contributors: getContributors,
  contributorCounts: function( callback ) {
    return getContributorCounts( 0, callback );
  },
  summaries: getSummaries
};
