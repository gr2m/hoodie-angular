'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var paths = {
    app: 'app',
    dist: 'www'
  };

  try {
    paths.app = require('./component.json').appPath || paths.app;
  } catch (e) {}

  grunt.initConfig({
    paths: paths,
    watch: {
      coffee: {
        files: ['<%= paths.app %>/scripts/{,*/}*.coffee'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['test/spec/{,*/}*.coffee'],
        tasks: ['coffee:test']
      },
      compass: {
        files: ['<%= paths.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass']
      },
      livereload: {
        files: [
          '<%= paths.app %>/{,*/}*.html',
          '{.tmp,<%= paths.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= paths.app %>}/scripts/{,*/}*.js',
          '<%= paths.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['livereload']
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, paths.app)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= paths.dist %>/*',
            '!<%= paths.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= paths.app %>/scripts/{,*/}*.js'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    coffee: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= paths.app %>/scripts',
          src: '{,*/}*.coffee',
          dest: '.tmp/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.coffee',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },
    compass: {
      options: {
        sassDir: '<%= paths.app %>/styles',
        cssDir: '.tmp/styles',
        imagesDir: '<%= paths.app %>/images',
        javascriptsDir: '<%= paths.app %>/scripts',
        fontsDir: '<%= paths.app %>/styles/fonts',
        importPath: '<%= paths.app %>/components',
        relativeAssets: true
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    concat: {
      dist: {
        files: {
          '<%= paths.dist %>/scripts/scripts.js': [
            '.tmp/scripts/{,*/}*.js',
            '<%= paths.app %>/scripts/{,*/}*.js'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= paths.app %>/index.html',
      options: {
        dest: '<%= paths.dist %>'
      }
    },
    usemin: {
      html: ['<%= paths.dist %>/{,*/}*.html'],
      css: ['<%= paths.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= paths.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= paths.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= paths.dist %>/images'
        }]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= paths.dist %>/styles/main.css': [
            '.tmp/styles/{,*/}*.css',
            '<%= paths.app %>/styles/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= paths.app %>',
          src: ['*.html', 'views/*.html'],
          dest: '<%= paths.dist %>'
        }]
      }
    },
    cdnify: {
      dist: {
        html: ['<%= paths.dist %>/*.html']
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= paths.dist %>/scripts',
          src: '*.js',
          dest: '<%= paths.dist %>/scripts'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= paths.dist %>/scripts/scripts.js': [
            '<%= paths.dist %>/scripts/scripts.js'
          ]
        }
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= paths.dist %>/scripts/{,*/}*.js',
            '<%= paths.dist %>/styles/{,*/}*.css',
            '<%= paths.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= paths.dist %>/styles/fonts/*'
          ]
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= paths.app %>',
          dest: '<%= paths.dist %>',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            'components/**/*',
            'images/{,*/}*.{gif,webp}',
            'styles/fonts/*'
          ]
        }]
      }
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('server', [
    'clean:server',
    'coffee:dist',
    'compass:server',
    'livereload-start',
    'connect:livereload',
    'open',
    'watch'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'coffee',
    'compass',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'jshint',
    'test',
    'coffee',
    'compass:dist',
    'useminPrepare',
    'imagemin',
    'cssmin',
    'htmlmin',
    'concat',
    'copy',
    'cdnify',
    'ngmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', ['build']);
};
