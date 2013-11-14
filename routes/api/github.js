var GitHub = require( '../../lib/webmaker.js' ).github;

module.exports = function( cache ) {

  return {
    repo: {
      tags: function( req, res ) {
        GitHub.repo.tags( req.params.repo, function( err, data ) {
          if ( err ) {
            res.json( 500, { error: 'Unable to get tags for repo ' + req.params.repo + '. ' + err.message } );
            return;
          }
          cache.write( req.url, data );
          res.json( data );
        });
      },
      commits: function( req, res ) {
        GitHub.repo.commits( req.params.repo, function( err, data ) {
          if ( err ) {
            res.json( 500, { error: 'Unable to get commits for repo ' + req.params.repo + '. ' + err.message } );
            return;
          }
          cache.write( req.url, data );
          res.json( data );
        });
      },
      contributors: function( req, res ) {
        GitHub.repo.contributors( req.params.repo, function( err, data ) {
          if ( err ) {
            res.json( 500, { error: 'Unable to get contributors for repo ' + req.params.repo + '. ' + err.message } );
            return;
          }
          cache.write( req.url, data );
          res.json( data );
        });
      }
    },
    components: {
      commits: {
        list: function( req, res ) {
          GitHub.components.commits.list( function( err, data ) {
            if ( err ) {
              res.json( 500, { error: 'Unable to component commits. ' + err.message } );
              return;
            }
            cache.write( req.url, data );
            res.json( data );
          });
        },
        counts: function( req, res ) {
          GitHub.components.commits.counts( function( err, data ) {
            if ( err ) {
              res.json( 500, { error: 'Unable to component commit counts. ' + err.message } );
              return;
            }
            cache.write( req.url, data );
            res.json( data );
          });
        },
      },
      contributors: {
        list: function( req, res ) {
          GitHub.components.contributors.list( function( err, data ) {
            if ( err ) {
              res.json( 500, { error: 'Unable to get the contributors per component list. ' + err.message } );
              return;
            }
            cache.write( req.url, data );
            res.json( data );
          });
        },
        counts: function( req, res ) {
          GitHub.components.contributors.counts( function( err, data ) {
            if ( err ) {
              res.json( 500, { error: 'Unable to get component contributor counts. ' + err.message } );
              return;
            }
            cache.write( req.url, data );
            res.json( data );
          });
        }
      },
      tags: {
        list: function( req, res ) {
          GitHub.components.tags.list( function( err, data ) {
            if ( err ) {
              res.json( 500, { error: 'Unable to get component tags. ' + err.message } );
              return;
            }
            cache.write( req.url, data );
            res.json( data );
          });
        },
        counts: function( req, res ) {
          GitHub.components.tags.counts( function( err, data ) {
            if ( err ) {
              res.json( 500, { error: 'Unable to get component tag counts. ' + err.message } );
              return;
            }
            cache.write( req.url, data );
            res.json( data );
          });
        }
      },
      summaries: function( req, res ) {
        GitHub.components.summaries( function( err, data ) {
          if ( err ) {
            res.json( 500, { error: 'Unable to get component summaries. ' + err.message } );
            return;
          }
          cache.write( req.url, data );
          res.json( data );
        });
      }
    },
    suite: {
      contributor: function( req, res ) {
          GitHub.suite.contributor( req.params.login, function( err, data ) {
            if ( err ) {
              res.json( 500, { error: 'Unable to get the contributor ' + req.params.login + '. ' + err.message } );
              return;
            }
            cache.write( req.url, data );
            res.json( data );
          });
      },
      commits: {
        count: function( req, res ) {
          GitHub.suite.commits.count( function( err, data ) {
            if ( err ) {
              res.json( 500, { error: 'Unable to get the commit count for the suite. ' + err.message } );
              return;
            }
            cache.write( req.url, data );
            res.json( data );
          });
        }
      },
      contributors: {
        list: function( req, res ) {
          GitHub.suite.contributors.list( function( err, data ) {
            if ( err ) {
              res.json( 500, { error: 'Unable to get the contributors list for the suite. ' + err.message } );
              return;
            }
            cache.write( req.url, data );
            res.json( data );
          });
        },
        count: function( req, res ) {
          GitHub.suite.contributors.count( function( err, data ) {
            if ( err ) {
              res.json( 500, { error: 'Unable to get the contributors count for the suite. ' + err.message } );
              return;
            }
            cache.write( req.url, data );
            res.json( data );
          });
        }
      },
      releases: {
        count: function( req, res ) {
          GitHub.suite.releases.count( function( err, data ) {
            if ( err ) {
              res.json( 500, { error: 'Unable to get the releases count for the suite. ' + err.message } );
              return;
            }
            cache.write( req.url, data );
            res.json( data );
          });
        }
      }
    }
  };

};
