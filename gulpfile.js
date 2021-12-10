const { parallel, series, watch } = require('gulp');
var gulp = require('gulp');
var sass = require('gulp-sass');
var mustache = require('gulp-mustache-plus');
var browserSync = require('browser-sync').create();

var sassDir = 'app/styling';

function buildTask(cb) {
    gulp.src("app/templates/*.mustache")
        .pipe(mustache({}, {}, {
            title: "Troy Baker",
            start: "app/templates/partials/start.mustache",
            end: "app/templates/partials/end.mustache"
        }))
        .pipe(gulp.dest("dist"));
    cb();
}

function sassTask() {
    return gulp.src(`${sassDir}/**/*.scss`) // Gets all files ending with .scss in app/scss and children dirs
        .pipe(sass())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
}

function browserSyncTask(cb) {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
    })

    cb();
}

function browserSyncReload(cb) {
    browserSync.reload();
    cb();
}

function watchTask() {
    watch('app/**/*.html', browserSyncReload);
    watch(['app/html/**/*.html', 'app/templates/**/*.mustache'], series(buildTask, browserSyncReload));
    watch([`${sassDir}/**/*.scss`], series(sassTask, browserSyncReload));
}

exports.default = series(sassTask, buildTask, browserSyncTask, watchTask)