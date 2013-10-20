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
      transifex.projectStats( function( err, stats ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get the project stats' } );
          return;
        }
        cache.write( req.url, stats );
        res.json( stats );
      });
    },
    componentStats: function( req, res ) {
      var component = req.params.component;
      transifex.componentStats( component, function( err, stats ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get the stats for requested component' } );
          return;
        }
        cache.write( req.url, stats );
        res.json( stats );
      });
    },
    getAllLanguages: function( req, res ) {
      transifex.getAllLanguages( function( err, langs ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get list of languages' } );
          return;
        }
        cache.write( req.url, langs );
        res.json( langs );
      });
    },
    getLangCompStats: function( req, res ) {
      var component = req.params.component,
          locale = req.params.locale;
      transifex.getLangCompStats( component, locale, function( err, stats ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get the requested language component stats' } );
          return;
        }
        cache.write( req.url, stats );
        res.json( stats );
      });
    }
  };

};
