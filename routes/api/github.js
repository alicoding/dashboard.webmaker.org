var Github = require( '../../lib/Webmaker.js' ).github;

module.exports = {
  tags: function( req, res ) {
    Github.tags( req.params.repo, function( err, tags ) {
      if ( err ) {
        res.json( 500, { error: 'Unable to get tags for repo ' + repo + '.' } );
        return;
      }
      res.json( tags );
    });
  }
};
