'use strict';

const dimensions = require('./build/dimensions');
const readWindow = require('./build/read-window');

module.exports = Object.assign({},
  dimensions,
  readWindow
);