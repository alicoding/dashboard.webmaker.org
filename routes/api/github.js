var GitHub = require( '../../lib/Webmaker.js' ).github;

module.exports = function( cache ) {

  return {
    repo: {
      tags: function( req, res ) {
        GitHub.repo.tags( req.params.repo, function( err, data ) {
          if ( err ) {
            res.json( 500, { error: 'Unable to get tags for repo ' + req.params.repo + '.' } );
            return;
          }
          cache.write( req.url, data );
          res.json( data );
        });
      },
      commits: function( req, res ) {
        GitHub.repo.commits( req.params.repo, function( err, data ) {
          if ( err ) {
            res.json( 500, { error: 'Unable to get commits for repo ' + req.params.repo + '.' } );
            return;
          }
          cache.write( req.url, data );
          res.json( data );
        });
      },
      contributors: function( req, res ) {
        GitHub.repo.contributors( req.params.repo, function( err, data ) {
          if ( err ) {
            res.json( 500, { error: 'Unable to get contributors for repo ' + req.params.repo + '.' } );
            return;
          }
          cache.write( req.url, data );
          res.json( data );
        });
      }
    },
    components: {
      commits: {
        counts: function( req, res ) {
          GitHub.components.commits.counts( function( err, data ) {
            if ( err ) {
              res.json( 500, { error: 'Unable to component commit counts.' } );
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
              res.json( 500, { error: 'Unable to get the contributors per component list.' } );
              return;
            }
            cache.write( req.url, data );
            res.json( data );
          });
        },
        counts: function( req, res ) {
          GitHub.components.contributors.counts( function( err, data ) {
            if ( err ) {
              res.json( 500, { error: 'Unable to get component contributor counts.' } );
              return;
            }
            cache.write( req.url, data );
            res.json( data );
          });
        }
      },
      tags: {
        counts: function( req, res ) {
          GitHub.components.tags.counts( function( err, data ) {
            if ( err ) {
              res.json( 500, { error: 'Unable to get component tag counts.' } );
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
            res.json( 500, { error: 'Unable to get component summaries.' } );
            return;
          }
          cache.write( req.url, data );
          res.json( data );
        });
      }
    },
    suite: {
      commits: {
        count: function( req, res ) {
          GitHub.suite.commits.count( function( err, data ) {
            if ( err ) {
              res.json( 500, { error: 'Unable to get the commit count for the suite.' } );
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
              res.json( 500, { error: 'Unable to get the contributors list for the suite.' } );
              return;
            }
            cache.write( req.url, data );
            res.json( data );
          });
        },
        count: function( req, res ) {
          GitHub.suite.contributors.count( function( err, data ) {
            if ( err ) {
              res.json( 500, { error: 'Unable to get the contributors count for the suite.' } );
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
              res.json( 500, { error: 'Unable to get the releases count for the suite.' } );
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
