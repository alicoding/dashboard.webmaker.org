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
    counts = {};
  components.forEach( function( component ) {
    getOpenCount( component, function( err, count ) {
      if ( !err ) {
        counts[ component ] = count;
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
    callback( null, bugs );
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
    callback( null, bugs );
  });
};
