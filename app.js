var express = require( "express" ),
    nunjucks = require( "nunjucks" ),
    path = require( "path" ),
    request = require( "request" ),
    app = express(),
    env = require( "./lib/config"),
    middleware = require( "./lib/middleware" ),
    nunjucksEnv = new nunjucks.Environment( new nunjucks.FileSystemLoader( path.join( __dirname + '/views' ) ) ),
    cache = require( "./lib/cache" ),
    routes = require( "./routes" )( cache );

// Cache check middleware: if the URL is in cache, use that.
function checkCache( req, res, next ) {
  if ( checkCache.overrides[ req.url ] ) {
    delete checkCache.overrides[ req.url ];
    next();
    return;
  }
  cache.read( req.url, function( err, data ) {
    if ( err || !data ) {
      next( err );
      return;
    }
    res.json( data );
  });
}
checkCache.overrides = {};

// Enable template rendering with nunjucks
nunjucksEnv.express( app );
// Don't send the "X-Powered-By: Express" header
app.disable( "x-powered-by" );

// Setup global middleware
app.use( express.logger( "dev" ) );
// Always put the compression middleware high up in the chain
app.use( express.compress() );
var tmpDir = path.normalize( require( "os" ).tmpDir() + "/mozilla.butter/" );
app.use( require( 'less-middleware' )({
  once: env.get( "OPTIMIZE_CSS" ),
  dest: tmpDir,
  src: __dirname + "/public",
  compress: env.get( "OPTIMIZE_CSS" ),
  yuicompress: env.get( "OPTIMIZE_CSS" ),
  optimization: env.get( "OPTIMIZE_CSS" ) ? 0 : 2
}));
app.use( express.static( tmpDir, JSON.parse( JSON.stringify( env.get( "STATIC_MIDDLEWARE" ) ) ) ) );
app.use( express.static( path.join( __dirname + "/public" ), JSON.parse( JSON.stringify( env.get( "STATIC_MIDDLEWARE" ) ) ) ) );
// bodyParser will parse "application/json", "application/x-www-form-urlencoded" and "multipart/form-data"
// requests and put the results on req.body and req.files. Handy!
// If you don't need to handle all three types then just use json(), urlencoded() or multipart() instead.
app.use( express.json() );
app.use( express.urlencoded() );
// cookieParser will parse "Cookie" headers, and cookieSession adds signed (not secret!) cookies.
// The advantage is that the server doesn't need to look up data from the DB on every request.
// The disadvantage is that any data saved into the cookie is visible to the user.
app.use( express.cookieParser() );
app.use( express.cookieSession({
  secret: env.get( "SECRET" ),
  cookie: {
    maxAge: 2678400000 // 31 days. Persona saves session data for 1 month
  },
  proxy: true
}));
// Attempt to use Express' routes defined below
app.use( app.router );
// Whenever you pass `next( someError )`, this middleware will handle it
app.use( middleware.errorHandler );

// Express routes
app.get( "/", routes.index );
app.get( "/healthcheck", routes.api.healthcheck );

// TODO these bugzilla routes need to be improved from a REST pov.
app.get( "/bugzilla/component/:component/open/count", checkCache, routes.api.bugzilla.openBugsCountByComponent );
app.get( "/bugzilla/component/:component/open", checkCache, routes.api.bugzilla.openBugsByComponent );
app.get( "/bugzilla/components/counts", checkCache, routes.api.bugzilla.componentCounts );
app.get( "/bugzilla/bug/:id", checkCache, routes.api.bugzilla.bug );
app.get( "/bugzilla/bugs/unconfirmed", checkCache, routes.api.bugzilla.unconfirmed );
app.get( "/bugzilla/bugs/today", checkCache, routes.api.bugzilla.today );

app.get( "/bugzilla/suite/count", checkCache, routes.api.bugzilla.overallCount );

app.get( "/github/repo/:repo/tags", checkCache, routes.api.github.repo.tags );
app.get( "/github/repo/:repo/commits", checkCache, routes.api.github.repo.commits );
app.get( "/github/repo/:repo/contributors", checkCache, routes.api.github.repo.contributors );

app.get( "/github/components/contributors", checkCache, routes.api.github.components.contributors.list );
app.get( "/github/components/contributors/counts", checkCache, routes.api.github.components.contributors.counts );
app.get( "/github/components/commits/counts", checkCache, routes.api.github.components.commits.counts );
app.get( "/github/components/tags/counts", checkCache, routes.api.github.components.tags.counts );
app.get( "/github/components/summaries", checkCache, routes.api.github.components.summaries );

app.get( "/github/suite/commits/count", checkCache, routes.api.github.suite.commits.count );
app.get( "/github/suite/contributors/count", checkCache, routes.api.github.suite.contributors.count );
app.get( "/github/suite/releases/count", checkCache, routes.api.github.suite.releases.count );

app.get( "/transifex/listOfContributors", checkCache, routes.api.transifex.numberOfContributors );
app.get( "/transifex/components/stats", checkCache, routes.api.transifex.projectStats );
app.get( "/transifex/components/:locale/stats", checkCache, routes.api.transifex.getLangStats );
app.get( "/transifex/languages", checkCache, routes.api.transifex.getAllLanguages );
app.get( "/transifex/:component/stats", checkCache, routes.api.transifex.componentStats );
app.get( "/transifex/:component/:locale/stats", checkCache, routes.api.transifex.getLangCompStats );
app.get( "/transifex/components/:locale/details", checkCache, routes.api.transifex.projectLangDetails );

// To increase client-side performance, we prime the cache with data we'll need.
// Each resource (route URL) can specify a unique frequency for updates. If
// none is given, the cache expiration time is used.
function primeCache( urlPrefix ) {
  // { url: "url-for-route", frequency: update-period-in-ms }
  [
    { url: "/bugzilla/components/counts" },
    { url: "/bugzilla/bugs/unconfirmed" },
    { url: "/bugzilla/bugs/today" },
    { url: "/bugzilla/suite/count" },
    { url: "/github/components/contributors" },
    { url: "/github/components/contributors/counts" },
    { url: "/github/components/commits/counts" },
    { url: "/github/components/tags/counts" },
    { url: "/github/components/summaries" },
    { url: "/github/suite/commits/count" },
    { url: "/github/suite/contributors/count" },
    { url: "/github/suite/releases/count" },
    { url: "/transifex/listOfContributors" },
    { url: "/transifex/components/stats" },
    { url: "/transifex/languages" }
  ].forEach( function( resource ) {
    var url = resource.url,
        frequency = resource.frequency || env.get( "CACHE_UPDATE" ) || 60 * 10 * 1000; // 10 mins

    function updateResource() {
      checkCache.overrides[ url ] = true;
      request.get( urlPrefix + url, function( err, resp, body ) {
        if ( err ) {
          console.log( "Error updating cache entry for %s: %s", url, err );
        }
      });
    }

    // Setup a timer to do this update, and also do one now
    updateResource();
    update = setInterval( updateResource, frequency );
    update.unref();
  });
}

// Start up the server
var port = env.get( "PORT", 3333 );
app.listen( port, function() {
  console.log( "Server listening (Probably http://localhost:%d )", port );

  // TODO - I need to pass in the protocol, hostname or IP for this app...
  primeCache( "http://localhost:" + port );
});
