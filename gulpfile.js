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
    webpackConfig    = require('./webpack.config.js');

var PRODUCTION = false;

var path = {
    /** Resources entry **/
    HTML_SRC:            'resources/html/**/*.html',
    JS_SRC:              'resources/js/**/*.js',
    SASS_DIR:            'resources/sass/',
    SASS_FILES:          'resources/sass/**/*.scss',
    IMAGE_DIR:           'resources/images/**/*.*',
    FONTS_DIR:           'resources/fonts/**/*.*',

    /** Resources Destinations **/
    HTML_DEST:           'public/',
    CSS_DEST:            'public/stylesheets/',
    LIB_DEST:            'public/js/lib/',
    IMAGE_DEST:          'public/images/',
    FONTS_DEST:          'public/fonts/',

    /** App **/
    APP_DEST:            'public/js/build/',
    APP_ENTRY:           './app/main.js',
    APP_MINIFIED_OUT:    'app.min.js',
    APP_OUT:             'app.js',
    APP_VIRTUAL_DIR:     '/app',
    APP_PUBLIC_SRC:      '/js/build/app.js',

    LIB_OUT:             'lib.js',
    LIB_PUBLIC_SRC:      '/js/lib/lib.js'

};

gulp.task('production', function () {
    PRODUCTION = true;
});

gulp.task('app:build', function () {
    var config = webpackConfig.production;
    config.entry.app = path.APP_ENTRY;
    config.output.path = path.APP_DEST;
    config.output.filename = path.APP_MINIFIED_OUT;

    webpack(config, function(err, stats) {
        if (err) throw new gutil.PluginError('build:app', err);
        gutil.log('[build:app]', stats.toString({colors: true}));
    });
});

gulp.task('app:watch', function () {
    var config = webpackConfig.dev;
    config.entry[2] = path.APP_ENTRY;
    config.output.path = path.APP_VIRTUAL_DIR;
    config.output.filename = path.APP_OUT;

    new webpackDevServer(webpack(config), {
        contentBase: path.HTML_DEST,
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
    gulp.src(path.SASS_FILES)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefix("last 1 version", "> 1%", "ie 8"))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.CSS_DEST));
});

gulp.task('watch_sass', function () {
    gulp.watch(path.SASS_FILES, ['place_css']);
});

gulp.task('place_images', function () {
    gulp.src(path.IMAGE_DIR)
        .pipe(imagemin())
        .pipe(gulp.dest(path.IMAGE_DEST));
});

gulp.task('place_fonts', function () {
    gulp.src(path.FONTS_DIR)
        .pipe(gulp.dest(path.FONTS_DEST));
});

gulp.task('place_lib', function () {
    gulp.src(path.JS_SRC)
        .pipe(sourcemaps.init())
        .pipe(concat(path.LIB_OUT))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.LIB_DEST));
});

gulp.task('place_html', function () {
    var app_location = (PRODUCTION) ? path.APP_PUBLIC_SRC : path.APP_OUT;

    gulp.src(path.HTML_SRC)
        .pipe(htmlreplace({
            'lib':  path.LIB_PUBLIC_SRC,
            'app': app_location
        }))
        .pipe(gulp.dest(path.HTML_DEST));
});

gulp.task('resources:build', ['place_html', 'place_lib', 'place_css', 'place_fonts', 'place_images']);
gulp.task('resources:watch', ['watch_sass']);

gulp.task('default', ['production', 'resources:build', 'app:build']);
gulp.task('dev', ['resources:build', 'resources:watch', 'app:watch']);


