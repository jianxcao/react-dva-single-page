const autoprefixer = require('autoprefixer');
const felxbugs = require('postcss-flexbugs-fixes');
const cssnano = require('cssnano');
module.exports = {
  loader: 'postcss-loader',
  plugins: [
    autoprefixer(),
    felxbugs(),
    cssnano({
      preset: 'default'
    })
  ]
};
