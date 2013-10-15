var bugzilla = require( '../../lib/Webmaker.js' ).bugzilla;

module.exports = {
  componentCounts: function( req, res ) {
    bugzilla.countByComponent( function( err, counts ) {
      if ( err ) {
        res.json( 500, { error: 'Unable to get Bugzilla counts.' } );
        return;
      }
      res.json( counts );
    });
  },
  unconfirmed: function( req, res ) {
    bugzilla.unconfirmed( function( err, bugs ) {
      if ( err ) {
        res.json( 500, { error: 'Unable to get unconfirmed bugs from Bugzilla - ' + err } );
        return;
      }
      res.json( bugs || [] );
    });
  }
};
