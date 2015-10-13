module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      gruntfile: {
        src: 'Gruntfile.js',
      },
      all: ['./js/src/**/*.js', './js/src/**/*.jsx'],
      options: {
        additionalSuffixes: ['.js'],
        esnext: true
      }
    },
    babel: {
        options: {
            sourceMap: true
        },
        all: {
            files: [{
                expand: true,
                cwd: 'js/src',
                src: ['**/*.js', '**/*.jsx'],
                dest: 'js/build/',
                ext: '.js'
            }]
        }
    },
    watch: {
      gruntfile: {
        'files': 'Gruntfile.js',
        'tasks': ['jshint:gruntfile']
      },
      src: {
        files: ['js/src/**/*.js', 'js/src/**/*.jsx'],
        tasks: ['default']
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsxhint');
  grunt.loadNpmTasks('grunt-babel');

  // Default task(s).
  grunt.registerTask('default', ['jshint:all', 'babel']);

};