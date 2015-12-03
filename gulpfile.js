var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    autoprefix  = require('gulp-autoprefixer'),
    htmlreplace = require('gulp-html-replace'),
    imagemin    = require('gulp-imagemin'),
    concat      = require('gulp-concat'),

    webpack          = require('webpack'),
    webpackDevServer = require('webpack-dev-server'),
    webpackConfig    = require('./webpack.config.js'),
    browserSync      = require('browser-sync'),

    routes             = require('./routes');

var PRODUCTION = false;

var use_browsersync = process.argv.indexOf('--browsersync') > -1;

if (use_browsersync) {
    browserSync.init({
        proxy: 'localhost:3000',
        notify: false,
        open: false
    });
}

gulp.task('production', function () {
    PRODUCTION = true;
});

gulp.task('app:build', function () {
    var config = webpackConfig.production;
    webpack(config, function(err, stats) {
        if (err) throw new gutil.PluginError('build:app', err);
        gutil.log('[build:app]', stats.toString({colors: true}));
    });
});

gulp.task('app:watch', function () {
    var config = webpackConfig.dev;
    new webpackDevServer(webpack(config), {
        contentBase: routes.HTML_DEST,
        publicPath: config.output.publicPath,
        stats: {colors: true},
        //noInfo: true,
        hot: true,
        historyApiFallback: true
    }).listen(3000, 'localhost', function(err) {
        if (err) throw new gutil.PluginError('watch:app', err);
        gutil.log('[webpack-dev-server]', 'Dev server running on http://localhost:3000/');
    });
});

gulp.task('place_css', function () {
    gulp.src(routes.SASS_FILES)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefix(["last 1 version", "> 1%", "ie 8"]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(routes.CSS_DEST))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('watch_sass', function () {
    gulp.watch(routes.SASS_FILES, ['place_css']);
});

gulp.task('place_images', function () {
    gulp.src(routes.IMAGE_DIR)
        .pipe(imagemin())
        .pipe(gulp.dest(routes.IMAGE_DEST));
});

gulp.task('place_fonts', function () {
    gulp.src(routes.FONTS_DIR)
        .pipe(gulp.dest(routes.FONTS_DEST));
});

gulp.task('place_lib', function () {
    gulp.src(routes.JS_SRC)
        .pipe(sourcemaps.init())
        .pipe(concat(routes.LIB_OUT))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(routes.LIB_DEST));
});

gulp.task('place_html', function () {
    var app_location = (PRODUCTION) ? routes.APP_PUBLIC_SRC : routes.APP_OUT;

    gulp.src(routes.HTML_SRC)
        .pipe(htmlreplace({
            'lib':  routes.LIB_PUBLIC_SRC,
            'app': app_location
        }))
        .pipe(gulp.dest(routes.HTML_DEST));
});

gulp.task('resources:build', ['place_html', 'place_lib', 'place_css', 'place_fonts', 'place_images']);
gulp.task('resources:watch', ['watch_sass']);

gulp.task('default', ['production', 'resources:build', 'app:build']);
gulp.task('dev', ['resources:build', 'resources:watch', 'app:watch']);


