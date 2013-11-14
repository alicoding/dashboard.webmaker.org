var transifex = require( 'transifex' ),
    env = require("../../lib/config.js"),
    project_slug = env.get("TRANSIFEX-PROJECT");

transifex.init({
  project_slug: project_slug,
  credential: env.get("TRANSIFEX-AUTH")
});

module.exports = function( cache ) {

  return {
    listOfContributors: function( req, res ) {
      transifex.listOfContributors( function( err, counts ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get Number of contributors.' } );
          return;
        }
        cache.write( req.url, counts );
        res.json( counts );
      });
    },
    projectStatisticsMethods: function( req, res ) {
      transifex.projectStatisticsMethods( function( err, stats ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get the project stats' } );
          return;
        }
        cache.write( req.url, stats );
        res.json( stats );
      });
    },
    allStatisticsMethods: function( req, res ) {
      var resource_slug = req.params.component;
      transifex.statisticsMethods( project_slug, resource_slug, function( err, stats ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get the stats for requested component' } );
          return;
        }
        cache.write( req.url, stats );
        res.json( stats );
      });
    },
    languageSetInfoMethods: function( req, res ) {
      transifex.languageSetInfoMethods( function( err, langs ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get list of languages' } );
          return;
        }
        cache.write( req.url, langs );
        res.json( langs );
      });
    },
    oneStatisticsMethods: function( req, res ) {
      var resource_slug = req.params.component,
          locale = req.params.locale;
      transifex.statisticsMethods( project_slug, resource_slug, locale, function( err, stats ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get the requested language component stats' } );
          return;
        }
        cache.write( req.url, stats );
        res.json( stats );
      });
    },
    languageStatisticsMethods: function( req, res ) {
      var locale = req.params.locale;
      transifex.languageStatisticsMethods( locale, function( err, stats ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get the requested language stats' } );
          return;
        }
        cache.write( req.url, stats );
        res.json( stats );
      });
    },
    languageInstanceMethod: function( req, res ) {
      var locale = req.params.locale;
      transifex.languageInstanceMethod( project_slug, locale, function( err, details ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get the requested language details' } );
          return;
        }
        cache.write( req.url, details );
        res.json( details );
      });
    }
  };

};
