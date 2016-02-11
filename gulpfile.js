var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    serve = require('gulp-serve');

gulp.task('js-deps', function () {
    gulp.src([
            './bower_components/jquery/dist/jquery.js',
            './bower_components/lodash/lodash.js',
            './bower_components/knockout/dist/knockout.js',
            './bower_components/pagerjs/pager.js',
            './bower_components/knockout-bootstrap/src/knockout-bootstrap.js',
            './bower_components/typeahead.js/dist/typeahead.bundle.js'
        ])
        .pipe(concat('deps.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/js'));
});

gulp.task('partials', function () {
    gulp.src('./public/js/**/*.html')
        .pipe(gulp.dest('./build/partials'))
        .pipe(livereload());
});

gulp.task('css-deps', function () {
    gulp.src([
            "./bower_components/bootstrap/dist/css/bootstrap.min.css",
            "./bower_components/font-awesome/css/font-awesome.min.css"
        ])
        .pipe(concat('css-deps.css'))
        .pipe(gulp.dest('./build/css'));

    gulp.src('./public/bower_components/font-awesome/fonts/*')
        .pipe(gulp.dest('./build/fonts'));
});

gulp.task('js', function () {
    var baseDir = __dirname + '/dev/js',
        outputDir = __dirname + '/build/js',
        outputFilename = 'app.js';

    gulp.src([baseDir + "/**/*.js"])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(sourcemaps.init())
        .pipe(concat(outputFilename))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(outputDir))
        .pipe(livereload());
});

gulp.task('less', function () {
    gulp.src([
            './dev/less/app.less'
        ])
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(gulp.dest('./build/css'))
        .pipe(livereload());
});

// TODO - not sure if I will need this
gulp.task('data', function () {
    gulp.src('./dev/js/data/data.json')
        .pipe(gulp.dest('./build/data/'));
});

gulp.task('serve', serve('.'));

gulp.task('watch', function () {
    livereload.listen({port: 35730});
    watch(['./public/javascripts/*.js', './public/javascripts/**/*.js'], function () {
        gulp.start('js');
    });

    watch('./public/less/*.less', function () {
        gulp.start('less');
    });

    watch(['./public/javascripts/*.html', './public/javascripts/**/*.html'], function () {
        gulp.start('partials');
    });
});

gulp.task('default', ['js-deps', 'partials', 'data', 'css-deps', 'js', 'less', 'watch', 'serve']);