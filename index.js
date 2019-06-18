'use strict';

const dimensions = require('./build/dimensions');
const readWindow = require('./build/styles');

module.exports = Object.assign({},
  dimensions,
  readWindow
);