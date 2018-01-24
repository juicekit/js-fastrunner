const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('test', function(){
  return gulp.src('src/**/*.spec.ts')
        .pipe(mocha({
            reporter: 'nyan',
            require: ['ts-node/register']
        }));
});

gulp.task('default', [ 'test' ]);