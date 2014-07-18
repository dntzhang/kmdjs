module.exports = function (grunt) {
  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '\r\n'
      },
      dist: {
          src: ['src/util.js','src/fix.js', 'src/blob.js', 'src/class.js', 'src/js_beautiful.js', 'src/raphael.js', 'src/depTree.js', 'src/request.js', 'src/uglify2.js','src/jslint.js', 'src/core.js'],
        dest: 'dist/kmd.js'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  // 默认任务
  grunt.registerTask('default', ['concat']);
}