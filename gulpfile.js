var gulp = require('gulp');


gulp.task('hello', function() {
  console.log('Hello Zell');
});


var sass = require('gulp-sass');

gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('watch', ['browserSync', 'sass'], function(){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});


var browserSync = require('browser-sync');

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
  });
});


var useref = require('gulp-useref');

// gulp.task('useref', function(){
//   var assets = useref.assets();
//
//   return gulp.src('app/*.html')
//     .pipe(assets)
//     .pipe(assets.restore())
//     .pipe(useref())
//     .pipe(gulp.dest('dist'));
// });


var uglify = require('gulp-uglify');

// gulp.task('useref', function(){
//   var assets = useref.assets();
//
//   return gulp.src('app/*.html')
//     .pipe(assets)
//     .pipe(uglify())
//     .pipe(assets.restore())
//     .pipe(useref())
//     .pipe(gulp.dest('dist'));
//   });


  var gulpIf = require('gulp-if');

  // gulp.task('useref', function(){
  //   var assets = useref.assets();
  //
  //   return gulp.src('app/*.html')
  //     .pipe(assets)
  //     .pipe(gulpIf('*.js', uglify()))
  //     .pipe(useref())
  //     .pipe(gulp.dest('dist'));
  //   });


    var minifyCSS = require('gulp-minify-css');

    gulp.task('useref', function(){
      var assets = useref.assets();

      return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpIf('*.css', minifyCSS()))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(useref())
        .pipe(gulp.dest('dist'));
    });


var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin({
    interlaced: true
  })))
  .pipe(gulp.dest('dist/images'));
});


gulp.task('fonts', function(){
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'));
});


var del = require('del');

gulp.task('clean', function(callback){
  del('dist');
  return cache.clearAll(callback);
});

gulp.task('clean:dist', function(callback){
  del(['dist/**/*', '!dist,images', '!dist/images/**/*'], callback);
});


var runSequence = require('run-sequence');

gulp.task('task-name', function(callback){
  runSequence('task-one', ['tasks', 'two', 'run', 'in', 'parallel'], 'task-three', callback);
});

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'useref', 'images', 'fonts'],
    callback
  );
});


gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  );
});
