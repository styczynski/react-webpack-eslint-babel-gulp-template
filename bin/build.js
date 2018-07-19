const gulp        = require('gulp');
const runSeq      = require('run-sequence');
const del         = require('del');
const plumber     = require('gulp-plumber');
const cache       = require('gulp-cached');
const webpack     = require('webpack');
const gulpWebpack = require('webpack-stream');
const path        = require('path');
const nodemon     = require('gulp-nodemon');
const livereload  = require('gulp-livereload');

//
// Function generating webpack config
//
const webpackConfigCommon = require('./webpack.common.config.js');


const PATHS = {
    workingDir: path.resolve(__dirname, '..'),
    app: path.resolve(__dirname, '../app'),
    srcAppEntry: path.resolve(__dirname, '../app/Root.jsx'),
    srcApp: [
        '../app/*.*',
        '../app/**/*'
    ],
    out: path.resolve(__dirname, '../target/'),
    outFiles: path.resolve(__dirname, '../target/**/*.*'),
    outServerVendorFiles: path.resolve(__dirname, '../target/vendor/**/*.*'),
    outAppEntry: path.resolve(__dirname, '../target'),
    buildCache: path.resolve(__dirname, '../cache'),
    outLibName: 'common.lib.min.js',
    outLibEntry: path.resolve(__dirname, '../target-lib/'),
    srcLibEntry: path.resolve(__dirname, '../lib/index.jsx')
};


gulp.task('clean', function(){
  return del([
    PATHS.outFiles,
  ], {force: true});
});

gulp.task('buildApp:release', function(){
  return gulp.src(PATHS.srcAppEntry)
    .pipe(cache('webpack', {optimizeMemory: true}))
    .pipe(plumber())
    .pipe(gulpWebpack( webpackConfigCommon(PATHS, 'prod'), webpack ))
    .pipe(gulp.dest(PATHS.outAppEntry));
});

gulp.task('buildApp:dev', function(){
  return gulp.src(PATHS.srcAppEntry)
    .pipe(cache('webpack', {optimizeMemory: true}))
    .pipe(plumber())
    .pipe(gulpWebpack( webpackConfigCommon(PATHS, 'dev'), webpack ))
    .pipe(gulp.dest(PATHS.outAppEntry));
});

gulp.task('buildLib:release', function(){
    return gulp.src(PATHS.srcLibEntry)
        .pipe(cache('webpack', {optimizeMemory: true}))
        .pipe(plumber())
        .pipe(gulpWebpack( webpackConfigCommon(PATHS, 'lib'), webpack ))
        .pipe(gulp.dest(PATHS.outLibEntry));
});

gulp.task('lib:release', function(){
    runSeq('buildLib:release');
});

gulp.task('build:release', function(){
  runSeq('clean', 'buildApp:release');
});

gulp.task('build:dev', function(){
  runSeq('clean', 'buildApp:dev');
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.start('build:dev');
  gulp.watch(PATHS.srcApp, { interval: 3007, dot: true }, ['buildApp:dev']);
});

gulp.task('server', function(){
  nodemon({
    'script': './run-server.js',
    ext: 'html'
  })
});

gulp.task('dev', function(){
  gulp.start('server', 'watch');
});

gulp.task('lib', function(){
    gulp.start('lib:release');
});

gulp.task('release', function(){
  gulp.start('build:release');
});