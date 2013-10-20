var bzURL = "https://api-dev.bugzilla.mozilla.org/1.3/",
    bugzilla = require( 'bz' ).createClient({ url: bzURL });

// BMO Webmaker Components, see:
// https://bugzilla.mozilla.org/page.cgi?id=productdashboard.html&product=Webmaker&bug_status=open&tab=components
var components = [
  'webmaker.org',
  'Popcorn Maker',
  'Thimble',
  'MakeAPI',
  'General',
  'Events',
  'Login',
  'X-Ray Goggles',
  'Projects',
  'DevOps',
  'Community',
  'popcorn.js',
  'Marketing',
  'Badges',
  'Profile',
  'Make Valet',
  'Webmaker-suite',
  'Editorial',
  'Metrics',
  'Legal and Abuse'
];

// The BZ api gives way more fields than we care about, trim it down
function trimBugs( bugs ) {

  function trimBug( bug ) {
    var trimmed = {};
    ( 'keywords creator last_change_time assigned_to whiteboard ' +
      'creation_time id depends_on severity component blocks '    +
      'url summary resolution alias status' )
    .split( ' ' )
    .forEach( function( prop ) {
      trimmed[ prop ] = bug[ prop ];
    });
    return trimmed;
  }

  // Single bug
  if ( !Array.isArray( bugs ) ) {
    return trimBug( bugs );
  }

  // Array of bugs
  return bugs.map( function( bug ) {
    return trimBug( bug );
  });
}

function getOpenCount( component, callback ) {
  bugzilla.countBugs({
    product: 'Webmaker',
    component: component,
    status: '__open__'
  },
  function( err, count ) {
    // If things fail, just return -1 as an error code
    if ( err ) {
      count = -1;
    }
   callback( null, count );
  });
}

module.exports.countByComponent = function( callback ) {
  var wait = components.length,
    counts = [];
  components.forEach( function( component ) {
    getOpenCount( component, function( err, count ) {
      if ( !err ) {
        counts.push({
          "component": component,
          "count": count
        });
      }
      wait--;
      if ( wait === 0 ) {
        callback( null, counts );
      }
    });
  });
};

module.exports.unconfirmed = function( callback ) {
  bugzilla.searchBugs({
    product: 'Webmaker',
    status: 'UNCONFIRMED'
  },
  function( err, bugs ) {
    if ( err ) {
      return callback( err );
    }
    callback( null, trimBugs( bugs ) );
  });
};

module.exports.today = function( callback ) {
  bugzilla.searchBugs({
    product: 'Webmaker',
    changed_after: '-1d'
  },
  function( err, bugs ) {
    if ( err ) {
      return callback( err );
    }
    callback( null, trimBugs( bugs ) );
  });
};

module.exports.openBugsByComponent = function( component, callback ) {
  if( components.indexOf( component ) === -1 ) {
    callback( 'Unknown Webmaker component: ' + component );
    return;
  }

  bugzilla.searchBugs({
    product: 'Webmaker',
    component: component,
    status: '__open__'
  },
  function( err, bugs ) {
    if ( err ) {
      return callback( err );
    }
    callback( null, trimBugs( bugs ) );
  });
};

module.exports.openBugsCountByComponent = function( component, callback ) {
  if( components.indexOf( component ) === -1 ) {
    callback( 'Unknown Webmaker component: ' + component );
    return;
  }

  bugzilla.countBugs({
    product: 'Webmaker',
    component: component,
    status: '__open__'
  },
  function( err, count ) {
    if ( err ) {
      return callback( err );
    }
    callback( null, count );
  });
};

module.exports.bug = function( id, withComments, callback ) {
  if ( typeof withComments === 'function' ) {
    callback = withComments;
    withComments = false;
  }
  bugzilla.getBug( id, function( err, bug ) {
    if ( err ) {
      return callback( err );
    }
    bug = trimBugs( bug );
    if ( !withComments ) {
      return callback( null, bug );
    }
    bugzilla.bugComments( id, function( err, comments ) {
      if ( err ) {
        return callback( err );
      }
      bug.comments = comments;
      callback( null, bug );
    });
  });
};
