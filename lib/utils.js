var http = require( "http" );

// error() function used from senchalabs/connect, which is MIT licensed
// just a handy way to pass an error message to an error handler
exports.error = function( code, msg ) {
  var err = new Error( msg || http.STATUS_CODES[ code ]);
  err.status = code;
  return err;
};

var components = [
  {
    name: "Webmaker.org",
    bugzilla: "webmaker.org",
    github: ["webmaker.org"]
  },
  {
    name: "Popcorn Maker",
    bugzilla: "Popcorn Maker",
    github: ["popcorn.webmaker.org"]
  },
  {
    name: "Thimble",
    bugzilla: "Thimble",
    github: ["thimble.webmaker.org"]
  },
  {
    name: "MakeAPI",
    bugzilla: "MakeAPI",
    github: [
      "makeapi",
      "makeapi-client"
    ]
  },
  {
    name: "General",
    bugzilla: "General",
    github: [
      "webmaker-ui",
      "node-webmaker-i18n",
      "node-webmaker-loginapi",
      "node-webmaker-postalservice"
    ]
  },
  {
    name: "Events",
    bugzilla: "Events"
  },
  {
    name: "Login",
    bugzilla: "Login",
    github: ["login.webmaker.org"]
  },
  {
    name: "X-Ray Goggles",
    bugzilla: "X-Ray Goggles",
    github: ["goggles.webmaker.org"]
  },
  {
    name: "Projects",
    bugzilla: "Projects"
  },
  {
    name: "DevOps",
    bugzilla: "DevOps"
  },
  {
    name: "Community",
    bugzilla: "Community"
  },
  {
    name: "PopcornJS",
    bugzilla: "popcorn.js",
    github: ["popcorn-js"]
  },
  {
    name: "Marketing",
    bugzilla: "Marketing"
  },
  {
    name: "Badges",
    bugzilla: "Badges",
    github: [
      "openbadges",
      "badges.mozilla.org",
      "openbadges-badges"
    ]
  },
  {
    name: "Profile",
    bugzilla: "Projects",
    github: [
      "webmaker-profile",
      "webmaker-profile-service"
    ]
  },
  {
    name: "Make Valet",
    bugzilla: "Make Valet",
    github: ["make-valet"]
  },
  {
    name: "Webmaker-suite",
    bugzilla: "Webmaker-suite",
    github: ["webmaker-suite"]
  },
  {
    name: "Editorial",
    bugzilla: "Editorial"
  },
  {
    name: "Metrics",
    bugzilla: "Metrics"
  },
  {
    name: "Legal and Abuse",
    bugzilla: "Legal and Abuse"
  }
];

module.exports.components = components;

module.exports.bugComponents = (function() {
  return components.map( function( component ) {
    return component.bugzilla;
  });
}());

module.exports.repos = (function() {
  var repos = [];
  for ( var i = 0; i < components.length; i++ ) {
    var github = components[ i ].github || [];
    for ( var j = 0; j < github.length; j++ ) {
      repos.push( github[ j ] );
    }
  }
  return repos;
}());
