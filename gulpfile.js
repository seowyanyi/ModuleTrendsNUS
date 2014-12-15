var browserify = require('browserify'),
    watchify = require('watchify'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    source = require('vinyl-source-stream'),
    sourceFile = './js/main.js', //change this
    destFolder = './js/', //change this
    destFile = 'somefilewhichiwant.js'; //change this
 
gulp.task('browserify', function() {
  return browserify(sourceFile)
  .bundle()
  .pipe(source(destFile))
  .pipe(gulp.dest(destFolder));
});
 
gulp.task('watch', function() {
  var bundler = watchify(sourceFile);
  bundler.on('update', rebundle);
 
  function rebundle() {
    return bundler.bundle()
      .pipe(source(destFile))
      .pipe(gulp.dest(destFolder));
  }
 
  return rebundle();
});
 
gulp.task('default', ['browserify', 'watch']);