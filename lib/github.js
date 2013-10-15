var GitHubAPI = require( "node-github" );

function createGitHub() {
  return new GitHubAPI({
    version: "3.0.0",
    timeout: "5000"
  });
}

module.exports.tags = function( repo, callback ) {
  var repos = createGitHub().getReposApi();
  repos.getTags({
    user: "mozilla",
    repo: repo
  }, callback );
};
