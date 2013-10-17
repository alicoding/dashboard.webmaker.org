// Bring in all your require modules
var express = require( "express" ),
    habitat = require( "habitat" ),
    nunjucks = require( "nunjucks" ),
    path = require( "path" );

// Load config from ".env"
habitat.load();

// Generate app variables
var app = express(),
    env = new habitat(),
    middleware = require( "./lib/middleware" ),
    nunjucksEnv = new nunjucks.Environment( new nunjucks.FileSystemLoader( path.join( __dirname + '/views' ) ) ),
    cache = require( "./lib/cache" ),
    routes = require( "./routes" )( cache );

// Cache check middleware: if the URL is in cache, use that.
function checkCache( req, res, next ) {
  cache.read( req.url, function( err, data ) {
    if ( err || !data ) {
      next( err );
      return;
    }
    res.json( data );
  });
}

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
app.get( "/bugzilla/components/counts", checkCache, routes.api.bugzilla.componentCounts );
app.get( "/bugzilla/bugs/unconfirmed", checkCache, routes.api.bugzilla.unconfirmed );
app.get( "/github/:repo/tags", checkCache, routes.api.github.tags );
app.get( "/github/:repo/:date/tags", checkCache, routes.api.github.tagsFromDate );
app.get( "/github/:repo/commits", checkCache, routes.api.github.commits );
app.get( "/github/:repo/contributors", checkCache, routes.api.github.contributors );
app.get( "/github/components/contributorCounts", checkCache, routes.api.github.contributorCounts );

// Start up the server
app.listen( env.get( "PORT", 3333 ), function() {
  console.log( "Server listening (Probably http://localhost:%d )", env.get( "PORT", 3333 ) );
});
