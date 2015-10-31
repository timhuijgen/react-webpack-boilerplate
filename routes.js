module.exports = {
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