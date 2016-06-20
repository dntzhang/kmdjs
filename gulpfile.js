var gulp = require('gulp'),
    kud = require('kud'),
    runSequence = require('run-sequence');

var config = require('./kmd.json');

gulp.task('kud',function(callback) {
    kud(config,function(bundle,min_bundle){
        console.log(bundle);
        console.log(min_bundle);
        callback();
    });
});

gulp.task('otherTask',function() {
    console.log('otherTask');
});

gulp.task('default',  function (taskDone) {
    runSequence(
        'kud',
        'otherTask',
        taskDone
    );
});