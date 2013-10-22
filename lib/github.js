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
    if ( err )
      return callback( err );
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

function getComponentTagCounts( callback ) {
  var wait = components.length,
      count = [];

  components.map( function( component ) {
    getTags( component, function( err, tags ) {
      if ( err )
        return callback( err );
      count.push({
        component: component,
        count: tags.length
      });
      if ( --wait === 0 )
        return callback( null, count );
    });
  });
}

function getComponentContributors( callback ) {
  var wait = components.length,
      contributorList = [];

  components.map( function( component ) {
    getContributors( component, function( err, contributors ) {
      if ( err )
        return callback( err );
      contributorList.push({
        component: component,
        contributors: contributors
      });
      if ( --wait === 0 )
        return callback( null, contributorList );
    });
  });
}

function getContributorCounts( callback ) {
  var wait = components.length,
      counts = [];

  components.map( function( component ) {
    getContributors( component, function( err, contributors ) {
      if ( err )
        return callback( err );
      counts.push({
        component: component,
        count: contributors.length
      });
      if ( --wait === 0 )
        return callback( null, counts );
    });
  });
}

function getCommitCounts( callback ) {
  var wait = components.length,
      counts = [];

  components.map( function( component ) {
    getCommits( component, function( err, commits ) {
      if ( err )
        return callback( err );
      counts.push({
        component: component,
        count: commits.length
      });
      if ( --wait === 0 )
        return callback( null, counts );
    })
  });
}

function getSummaries( callback ) {
  getContributorCounts( function( err, contributorCounts ) {
    if ( err )
      return callback( err );
    getCommitCounts( function( err, commitCounts ) {
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

function getSuiteContributors( callback ) {
  getComponentContributors( function( err, components ) {
    if ( err )
      return callback( err );

    var uniqueContributors = [];
    function findContributor( login ) {
      for ( var i = 0; i < uniqueContributors.length; i++ ) {
        if ( login === uniqueContributors[ i ].login )
          return i;
      }
      return -1;
    }

    components.forEach( function( component ) {
      component.contributors.forEach( function( contributor ) {
        var index = findContributor( contributor.login );
        if ( index < 0 )
          uniqueContributors.push( contributor );
        else
          uniqueContributors[ index ].contributions += contributor.contributions;
      });
    });
    callback( null, uniqueContributors );
  });
}

module.exports = {
  repo: {
    tags: getTags,
    commits: getCommits,
    contributors: getContributors
  },
  components: {
    commits: {
      counts: getCommitCounts
    },
    contributors: {
      list: getComponentContributors,
      counts: getContributorCounts
    },
    tags: {
      counts: getComponentTagCounts
    },
    summaries: getSummaries
  },
  suite: {
    contributor: function( login, callback ) {
      getSuiteContributors( function( err, contributors ) {
        if ( err )
          return ( err );
        for ( var i = 0; i < contributors.length; i++ ) {
          if ( login === contributors[ i ].login )
            return callback( null, contributors[ i ] );
        }
        return callback( { message: "Can't find requested contributor."} );
      });
    },
    commits: {
      count: function( callback ) {
        getCommitCounts( function( err, components ) {
          if ( err )
            return callback( err );
          var count = 0;
          components.forEach( function( component ) {
            count += component.count;
          });
          callback( null, { count: count } );
        });
      }
    },
    contributors: {
      list: getSuiteContributors,
      count: function( callback ) {
        getSuiteContributors( function( err, contributors ) {
          if ( err )
            return callback( err );
          return callback( null, { count: contributors.length } );
        });
      }
    },
    releases: {
      count: function( callback ) {
        getComponentTagCounts( function( err, components ) {
          if ( err )
            return callback( err );
          var count = 0;
          components.forEach( function( component ) {
            count += component.count;
          });
          callback( null, { count: count } );
        });
      }
    }
  }
};
