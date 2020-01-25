'use strict';

const dimensions = require('./build/dimensions');
const readWindow = require('./build/read-window');
const smoooth = require('./build/scroll');

module.exports = Object.assign({},
  dimensions,
  readWindow,
  smoooth
);