var GitHub = require( '../../lib/Webmaker.js' ).github;

module.exports = {
  tags: function( req, res ) {
    GitHub.tags( req.params.repo, function( err, tags ) {
      if ( err ) {
        res.json( 500, { error: 'Unable to get tags for repo ' + req.params.repo + '.' } );
        return;
      }
      res.json( tags );
    });
  },
  tagsFromDate: function( req, res ) {
    GitHub.tagsFromDate( req.params.repo, req.params.date, function( err, tags ) {
      if ( err ) {
        res.json( 500, { error: 'Unable to get tags for repo ' + req.params.repo +
                                ' from date ' + req.params.date + '.' } );
        return;
      }
      res.json( tags );
    });
  },
  commits: function( req, res ) {
    GitHub.commits( req.params.repo, function( err, commits ) {
      if ( err ) {
        res.json( 500, { error: 'Unable to get commits for repo ' + req.params.repo + '.' } );
        return;
      }
      res.json( commits );
    });
  },
};
