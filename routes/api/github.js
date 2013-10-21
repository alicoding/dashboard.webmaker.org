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
    }
  };

};
