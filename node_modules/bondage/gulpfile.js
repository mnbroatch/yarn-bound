const gulp = require('gulp');
const gutil = require('gulp-util');
const babel = require('gulp-babel');
const webpack = require('webpack');

require('babel-polyfill');

const WEBPACK_CONFIG = {
  entry: [
    'babel-polyfill',
    './target/bondage.js',
  ],
  output: {
    path: './dist',
    filename: 'bondage.min.js',
    libraryTarget: 'var',
    library: 'bondage',
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),
  ],
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
    ],
  },
  node: {
    fs: 'empty',
  },
};

gulp.task('default', ['webpack']);

gulp.task('babel', () => {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('target'));
});

gulp.task('webpack', ['babel'], (callback) => {
  webpack(WEBPACK_CONFIG, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);

    gutil.log('[webpack]', stats.toString({
      colors: true,
      progress: true,
    }));
    callback();
  });
});
