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
  }
};
