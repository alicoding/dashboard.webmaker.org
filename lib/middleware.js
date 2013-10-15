var utils = require( "./utils" );

// Bare minimum error handling page
// Ideally you'd render a user-friendly error page
// Need to figure out best way to handle API vs user-facing error handlers
exports.errorHandler = function( err, req, res, next ) {
  return next( utils.error( err.status, err ) );
};
