var GitHub = require( '../../lib/Webmaker.js' ).github;

module.exports = function( cache ) {

  return {
    tags: function( req, res ) {
      GitHub.tags( req.params.repo, function( err, tags ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get tags for repo ' + req.params.repo + '.' } );
          return;
        }
        cache.write( req.url, tags );
        res.json( tags );
      });
    },
    tagsFromDate: function( req, res ) {
      GitHub.tagsFromDate( req.params.repo, req.params.date, function( err, tags ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get tags for repo ' + req.params.repo +
                           ' from date ' + req.params.date + '.' } );
          return;
        }
        cache.write( req.url, tags );
        res.json( tags );
      });
    },
    commits: function( req, res ) {
      GitHub.commits( req.params.repo, function( err, commits ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get commits for repo ' + req.params.repo + '.' } );
          return;
        }
        cache.write( req.url, commits );
        res.json( commits );
      });
    },
    contributors: function( req, res ) {
      GitHub.contributors( req.params.repo, function( err, contributors ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get contributors for repo ' + req.params.repo + '.' } );
          return;
        }
        cache.write( req.url, contributors );
        res.json( contributors );
      });
    },
    contributorCounts: function( req, res ) {
      GitHub.contributorCounts( 0, function( err, counts ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get component contributor counts.' } );
          return;
        }
        cache.write( req.url, counts );
        res.json( counts );
      });
    }
  };

};
