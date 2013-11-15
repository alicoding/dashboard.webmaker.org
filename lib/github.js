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
  numPages: -1 // Means that all the pages will be retrieved by default
};

function assignDefaultOptions( options ) {
  options = options || {};
  for ( var option in DEFAULTS )
    options[ option ] = options[ option ] || DEFAULTS[ option ];
  return options;
}

function githubQuery( api, query, options, callback ) {

  function getPages( github, page, count, max, callback ) {
    if ( count === max || !github.hasNextPage( page ) )
      return callback( null, [] );

    github.getNextPage( page, function( err, nextPage ) {
      if ( err )
        return callback( err );
      getPages( github, nextPage, ++count, max, function( err, pages ) {
        if ( err )
          return callback( err );
        return callback( null, nextPage.concat( pages ) );
      });
    });
  }

  var github = createGitHubAPI();
  github[api][query]( options, function( err, firstPage ) {
    if ( err )
      return callback( err );
    getPages( github, firstPage, 0, options.numPages, function( err, pages ) {
      if ( err )
        return callback( err );
      return callback( null, firstPage.concat( pages ) );
    });
  });
}

function repoQuery( query, options, callback ) {
  githubQuery( "repos", query, options, function( err, pages ) {
    if ( err )
      return callback( err );
    return callback( null, pages );
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

function getComponentTags( index, callback ) {
  if ( index === components.length ) {
    return callback( null, [] );
  }

  getTags( components[ index ], function( err, tags ) {
    if ( err ) {
      return callback( err );
    }
    getComponentTags( index + 1, function( err, componentTags ) {
      if ( err ) {
        return callback( err );
      }
      componentTags.push({
        component: components[ index ],
        tags: tags
      });
      return callback( null, componentTags );
    });
  });
}

function getComponentTagCounts( callback ) {
  getComponentTags( 0, function( error, componentTags ) {
    if ( error ) {
      return callback( error );
    }
    var counts = [];
    componentTags.forEach( function( data ) {
      counts.push({
        component: data.component,
        count: data.tags.length
      });
    });
    return callback( null, counts );
  });
}

function getComponentContributors( index, callback ) {
  if ( index === components.length ) {
    return callback( null, [] );
  }

  getContributors( components[ index ], function( err, contributors ) {
    if ( err ) {
      return callback( err );
    }
    getComponentContributors( index + 1, function( err, contributorList ) {
      if ( err ) {
        return callback( err );
      }
      contributorList.push({
        component: components[ index ],
        contributors: contributors
      });
      return callback( null, contributorList );
    });
  });
}

function getContributorCounts( index, callback ) {
  if ( index === components.length ) {
    return callback( null, [] );
  }

  getContributors( components[ index ], function( err, contributors ) {
    if ( err ) {
      return callback( err );
    }
    getContributorCounts( index + 1, function( err, counts ) {
      if ( err ) {
        return callback( err );
      }
      counts.push({
        component: components[ index ],
        count: contributors.length
      });
      return callback( null, counts );
    });
  });
}

function getComponentCommits( index, callback ) {
  if ( index === components.length ) {
    return callback( null, [] );
  }

  getCommits( components[ index ], function( err, commits ) {
    if ( err ) {
      return callback( err );
    }
    getComponentCommits( index + 1, function( err, componentCommits ) {
      if ( err ) {
        return callback( err );
      }
      componentCommits.push({
        component: components[ index ],
        commits: commits
      });
      return callback( null, componentCommits );
    });
  });
}

function getCommitCounts( callback ) {
  getComponentCommits( 0, function( error, componentCommits ) {
    if ( error ) {
      return callback( error );
    }
    var commitCounts = [];
    componentCommits.forEach( function( data ) {
      commitCounts.push({
        component: data.component,
        count: data.commits.length
      });
    });
    return callback( null, commitCounts );
  });
}

function getSummaries( callback ) {
  getContributorCounts( 0, function( err, contributorCounts ) {
    if ( err )
      return callback( err );
    getCommitCounts( function( err, commitCounts ) {
      if ( err )
        return callback( err );

      if ( contributorCounts.length !== components.length ||
           commitCounts.length !== components.length ) {
        return callback( { message: "Should have a contributor count and " +
                                    "commit count for each component." } );
      }

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
  getComponentContributors( 0, function( err, contributors ) {
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

    contributors.forEach( function( data ) {
      data.contributors.forEach( function( contributor ) {
        var index = findContributor( contributor.login );
        if ( index < 0 )
          uniqueContributors.push( contributor );
        else
          uniqueContributors[ index ].contributions += contributor.contributions;
      });
    });
    return callback( null, uniqueContributors );
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
      list: function( callback ) {
        getComponentCommits( 0, callback );
      },
      counts: function( callback ) {
        getCommitCounts( callback );
      }
    },
    contributors: {
      list: function( callback ) {
        getComponentContributors( 0, callback );
      },
      counts: function( callback ) {
        getContributorCounts( 0, callback );
      }
    },
    tags: {
      list: function( callback ) {
        getComponentTags( 0, callback );
      },
      counts: function( callback ) {
        getComponentTagCounts( callback );
      }
    },
    summaries: getSummaries
  },
  suite: {
    contributor: function( login, callback ) {
      getSuiteContributors( function( err, contributors ) {
        if ( err )
          return callback( err );
        for ( var i = 0; i < contributors.length; i++ ) {
          if ( login === contributors[ i ].login )
            return callback( null, contributors[ i ] );
        }
        return callback( { message: "Can't find requested contributor."} );
      });
    },
    commits: {
      count: function( callback ) {
        getCommitCounts( function( err, commitCounts ) {
          if ( err )
            return callback( err );
          var count = 0;
          commitCounts.forEach( function( data ) {
            count += data.count;
          });
          return callback( null, { count: count } );
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
        getComponentTagCounts( function( err, tagCounts ) {
          if ( err )
            return callback( err );
          var count = 0;
          tagCounts.forEach( function( data ) {
            count += data.count;
          });
          return callback( null, { count: count } );
        });
      }
    }
  }
};
