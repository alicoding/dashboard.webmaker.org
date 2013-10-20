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
    },
    today: function( req, res ) {
      bugzilla.today( function( err, bugs ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get today\'s bugs from Bugzilla - ' + err } );
          return;
        }
        cache.write( req.url, bugs );
        res.json( bugs );
      });
    },
    openBugsByComponent: function( req, res ) {
      var component = req.params.component;
      bugzilla.openBugsByComponent( component, function( err, bugs ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get open bugs for ' + component + ' Webmaker component - ' + err } );
          return;
        }
        cache.write( req.url, bugs );
        res.json( bugs );
      });
    },
    openBugsCountByComponent: function( req, res ) {
      var component = req.params.component;
      bugzilla.openBugsCountByComponent( component, function( err, counts ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get Bugzilla counts for component ' + component } );
          return;
        }
        cache.write( req.url, counts );
        res.json( counts );
      });
    },
    bug: function( req, res ) {
      var id = req.params.id;
      bugzilla.bug( id, true, function( err, bug ) {
        if ( err ) {
          res.json( 500, { error: 'Unable to get bug ' + id + ' - ' + err } );
          return;
        }
        cache.write( req.url, bug );
        res.json( bug );
      });
    }
  };

};
