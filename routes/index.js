module.exports = function( cache ) {

  return {
    api: {
      healthcheck: require( "./api/healthcheck.js" ),
      bugzilla: require( "./api/bugzilla.js" )( cache ),
      github: require( "./api/github.js")( cache ),
      transifex: require( "./api/transifex.js")( cache )
    }
  };

};
