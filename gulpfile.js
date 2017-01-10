const gulp = require('gulp');
const zip = require('gulp-zip');
const mocha = require('gulp-mocha');

gulp.task('test', () => {
    gulp.src('specs/*', {
            read: false
        })
        .pipe(mocha({
            reporter: 'spec'
        }))
});

gulp.task('create_payload', () => {
    gulp.src('./dist/**', {
            base: './dist'
        })
        .pipe(zip('payload.zip'))
        .pipe(gulp.dest('.'));
});

gulp.task('setup_source', () => {
    gulp.src('./src/*', {
            base: './src'
        })
        .pipe(gulp.dest('./dist'));
});

gulp.task('setup_dependencies', () => {
    gulp.src('./node_modules/dependency-binder', {
            base: '.'
        })
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['test', 'setup_dependencies', 'setup_source', 'create_payload']);
