// only used for jest
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }]
  ],
  exclude: /node_modules\\(?!(@mnbroatch)\/).*/
}
