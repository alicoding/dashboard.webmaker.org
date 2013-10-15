// A Gruntfile controls how `grunt` is run.
// http://gruntjs.com/getting-started is a pretty great guide

module.exports = function( grunt ) {
  grunt.initConfig({
    pkg: grunt.file.readJSON( "package.json" ),

    csslint: {
      files: {
        options: {
          "adjoining-classes": false,
          "gradients": false
        },
        src: [
          "public/**/*.css"
        ]
      }
    },
    jshint: {
      files: [
        "Gruntfile.js",
        "app.js",
        "lib/**/*.js",
        "package.json",
        "public/**/*.js",
        "routes/**/*.js"
      ]
    }
  });

  grunt.loadNpmTasks( "grunt-contrib-csslint" );
  grunt.loadNpmTasks( "grunt-contrib-jshint" );

  // The default tasks to run when no tasks are passed on the command line
  grunt.registerTask( "default", [ "csslint", "jshint" ]);
};
