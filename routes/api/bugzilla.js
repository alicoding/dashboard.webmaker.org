var bugzilla = require( '../../lib/Webmaker.js' ).bugzilla;

module.exports = function( cache ) {

  return {
    componentCounts: function( req, res ) {
      bugzilla.countByComponent( function( err, counts ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get Bugzilla counts.' } );
          return;
        }
        cache.write( req.url, counts );
        res.json( counts );
      });
    },
    unconfirmed: function( req, res ) {
      bugzilla.unconfirmed( function( err, bugs ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get unconfirmed bugs from Bugzilla - ' + err } );
          return;
        }
        cache.write( req.url, bugs );
        res.json( bugs );
      });
    }
  };

};
