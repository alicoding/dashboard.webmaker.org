var GitHub = require( '../../lib/Webmaker.js' ).github;

module.exports = function( cache ) {

  return {
    tags: function( req, res ) {
      GitHub.tags( req.params.repo, function( err, data ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get tags for repo ' + req.params.repo + '.' } );
          return;
        }
        cache.write( req.url, data );
        res.json( data );
      });
    },
    tagsFromDate: function( req, res ) {
      GitHub.tagsFromDate( req.params.repo, req.params.date, function( err, data ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get tags for repo ' + req.params.repo +
                           ' from date ' + req.params.date + '.' } );
          return;
        }
        cache.write( req.url, data );
        res.json( data );
      });
    },
    commits: function( req, res ) {
      GitHub.commits( req.params.repo, function( err, data ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get commits for repo ' + req.params.repo + '.' } );
          return;
        }
        cache.write( req.url, data );
        res.json( data );
      });
    },
    commitCounts: function( req, res ) {
      GitHub.commitCounts( function( err, data ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to component commit counts.' } );
          return;
        }
        cache.write( req.url, data );
        res.json( data );
      });
    },
    contributors: function( req, res ) {
      GitHub.contributors( req.params.repo, function( err, data ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get contributors for repo ' + req.params.repo + '.' } );
          return;
        }
        cache.write( req.url, data );
        res.json( data );
      });
    },
    contributorCounts: function( req, res ) {
      GitHub.contributorCounts( function( err, data ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get component contributor counts.' } );
          return;
        }
        cache.write( req.url, data );
        res.json( data );
      });
    },
    summaries: function( req, res ) {
      GitHub.summaries( function( err, data ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get component summaries.' } );
          return;
        }
        cache.write( req.url, data );
        res.json( data );
      });
    }
  };

};
