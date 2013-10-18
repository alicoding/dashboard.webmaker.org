var transifex = require( '../../lib/Webmaker.js' ).transifex;

module.exports = function( cache ) {

  return {
    numberOfContributors: function( req, res ) {
      transifex.numberOfContributors( function( err, counts ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get Number of contributors.' } );
          return;
        }
        cache.write( req.url, counts );
        res.json( counts );
      });
    },
    projectStats: function( req, res ) {
      transifex.projectStats( function( err, counts ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get the project stats' } );
          return;
        }
        cache.write( req.url, counts );
        res.json( counts );
      });
    }
  };

};
