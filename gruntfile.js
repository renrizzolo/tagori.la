module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
    	  options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        src: ['src/js/app.js', 'src/js/instagram/controller.js','src/js/instagram/scroll-repeat.js' ],
        dest: 'dist/js/app.min.js'
      }
    },
      cssmin: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          'css/style.min.css': 'css/**.css'
        }
      }
    },
   

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');


  // Default task(s).
  grunt.registerTask('default', ['uglify', 'cssmin']);

};