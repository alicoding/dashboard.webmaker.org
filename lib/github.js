var GitHubAPI = require( "node-github" ),
    moment = require( "moment" ),
    github = new GitHubAPI({
      version: "3.0.0",
      timeout: "5000"
    }),
    repos = github.getReposApi();

// TODO: These only return the first page of the results. To do this correctly
//       we would have to be able to specify the page as well. We can do this
//       through using the paging API in node-github.

function tags ( repo, callback ) {
  repos.getTags({
    user: "mozilla",
    repo: repo
  }, callback );
}

function commits( repo, callback ) {
  repos.getCommits({
    user: "mozilla",
    repo: repo
  }, callback );
}

function tagsFromDate( repo, date, callback ) {
  tags( repo, function( err, tags ) {
    if ( err ) {
      callback( err );
      return;
    }
    commits( repo, function( err, commits ) {
      if ( err ) {
        callback( err );
        return;
      }
      var resTags = [],
          fromDate = moment( date, "YYYY-MM-DD" );
      for ( var i = 0; i < commits.length; i++ ) {
        var commitDate = moment( commits[ i ].commit.committer.date, "YYYY-MM-DD" );
        if ( fromDate.diff( commitDate, "days") > 0 ) {
          break;
        }
        for ( var x = 0; x < tags.length; x++ ) {
          if ( tags[ x ].commit.sha === commits[ i ].sha ) {
            resTags.push( tags[ x ] );
          }
        }
      }
      callback( undefined, resTags );
    });
  });
}

module.exports.tags = tags;
module.exports.tagsFromDate = tagsFromDate;
module.exports.commits = commits;
