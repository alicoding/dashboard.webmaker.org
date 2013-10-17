module.exports = function( cache ) {

  return {
    index: function( req, res ) {
      res.render( "index.html" );
    },
    api: {
      healthcheck: require( "./api/healthcheck.js" ),
      bugzilla: require( "./api/bugzilla.js" )( cache ),
      github: require( "./api/github.js")( cache ),
      transifex: require( "./api/transifex.js")( cache )
    }
  };

};
