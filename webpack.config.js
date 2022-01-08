const common = {
  entry: './src/index.js',
  output: {
    filename: 'yarn-bound.min.js',
    library: {
      name: 'YarnBound',
      type: 'umd',
    },
    globalObject: 'this',
  },
  module: {
    rules: [{
      test: /\.js/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env',
              {
                modules: 'cjs',
                targets: 'last 4 years',
              },
            ],
          ],
          plugins: ['add-module-exports'],
        },
      },
    }],
  },
};

module.exports = [
  common,
  {
    ...common,
    output: {
      ...common.output,
      filename: 'yarn-bound.js',
    },
    optimization: {
      ...common.optimization,
      minimize: false,
    },
  },
  {
    ...common,
    target: ['web', 'es5'],
    output: {
      ...common.output,
      filename: 'yarn-bound.ie.js',
    },
    module: {
      rules: [{
        // test: /\.js/,
        // exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env',
                {
                  modules: 'cjs',
                  useBuiltIns: 'usage',
                  corejs: 3,
                  targets: 'ie 11',
                },
              ],
            ],
            plugins: ['add-module-exports'],
          },
        },
      }],
    },
  },
];
