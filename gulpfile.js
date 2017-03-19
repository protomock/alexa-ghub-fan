var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('test', () => {
    return gulp.src('specs/*', {
            read: false
        })
        .pipe($.mocha({
            reporter: 'dot',
            bail: true
        }))
});

gulp.task('zip_and_upload', ['setup_source'], () => {
    return gulp.src('./dist/**', {
            base: './dist'
        })
        .pipe($.zip('payload.zip'))
        .pipe($.awslambda({
            FunctionName: "GitHubHelper",
            Role: process.env.LAMBDA_ROLE
        }))
});

gulp.task('setup_source', ['test'], () => {
    return gulp.src('./src/*', {
            base: './src'
        })
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['zip_and_upload'])
