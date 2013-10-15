var http = require( "http" );

// error() function used from senchalabs/connect, which is MIT licensed
// just a handy way to pass an error message to an error handler
exports.error = function( code, msg ) {
  var err = new Error( msg || http.STATUS_CODES[ code ]);
  err.status = code;
  return err;
};
