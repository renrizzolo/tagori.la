module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
    	  options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        src: ['src/js/app-copy.js', 'src/js/instagram/controller.js' ],
        dest: 'app/dist/js/app.min.js'
      }
    },
    jshint: {
       
      build: 'src/js/instagram/controller.js'
    
    },
      cssmin: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          'app/css/style.min.css': ['css/style.css','css/ngDialog.min.css','css/ngDialog-theme-plain.css']
        }
      }
    },
   
  watch: {
      css: {
        files: 'css/**.css',
        tasks: ['cssmin']
      },
       scripts: {
        files: ['src/**.js','src/**/**.js'],
        tasks: ['uglify']
      }
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');


  // Default task(s).
  grunt.registerTask('default', ['uglify', 'cssmin', 'jshint']);

};