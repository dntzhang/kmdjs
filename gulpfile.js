var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('concat', function () {
    gulp.src(['src/util.js','src/fix.js', 'src/blob.js', 'src/class.js', 'src/js_beautiful.js',  'src/depTree.js', 'src/request.js', 'src/uglify2.js','src/jslint.js', 'src/core.js'])
        .pipe(concat('kmd.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['concat']);