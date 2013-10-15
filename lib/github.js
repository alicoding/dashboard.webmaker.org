var GitHubAPI = require( "node-github" ),
    github = new GitHubAPI({
      version: "3.0.0",
      timeout: "5000"
    }),
    repos = github.getReposApi();

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

module.exports.tags = tags;
module.exports.commits = commits;
