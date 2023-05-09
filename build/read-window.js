'use strict';

var _require = require('conjunction-junction'),
    isObjectLiteral = _require.isObjectLiteral;

var getIdFromPathname = function getIdFromPathname() {
  var integer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  var pathname = typeof window !== 'undefined' && window.location && typeof window.location.pathname === 'string' ? window.location.pathname : '';
  var arr = pathname.split('/');
  var _id = arr[arr.length - 1];
  var id = integer ? parseInt(_id, 10) : _id;
  return id;
};

var getPageName = function getPageName() {
  var pathname = typeof window !== 'undefined' && window.location && typeof window.location.pathname === 'string' ? window.location.pathname : '';
  var arr = pathname.split('/');
  var page = arr[1];
  return page;
};

var getWindowSearchArr = function getWindowSearchArr(int) {
  if (window && window.location && typeof window.location.search === 'string') {
    var search = window.location.search;
    var split = search.split('?');
    var searchArr = typeof split[1] === 'string' ? split[1].split(',') : [];
    var finalArr = int ? searchArr.map(function (t) {
      return parseInt(t, 10);
    }) : searchArr;
    return finalArr;
  }
  return [];
};

var buildQueryString = function buildQueryString(options) {
  var queryArr = [];
  if (isObjectLiteral(options)) {
    for (var key in options) {
      queryArr.push(key + '=' + options[key]);
    }
  }
  var query = queryArr.length > 0 ? '?' + queryArr.join('&') : '';
  return query;
};

var getQueryString = function getQueryString() {
  // read global window object
  // return a query string as-is (without ?) if exists
  // if does not exist, return empty string
  if (typeof window === 'undefined') {
    return '';
  }
  var queryString = window.location && typeof window.location.search === 'string' && window.location.search.length > 1 ? window.location.search.slice(1, window.location.search.length) : '';
  return queryString;
};

var cleanUri = function cleanUri() {
  var uri = typeof window !== 'undefined' && window.location && typeof window.location.toString === 'function' ? window.location.toString() : '';
  var qIndex = uri.indexOf('?');
  if (qIndex > 0) {
    var _cleanUri = uri.substring(0, qIndex);
    window.history.replaceState({}, document.title, _cleanUri);
  }
};

var parseQueryString = function parseQueryString() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var win = typeof window !== 'undefined' ? window : {};
  var loc = win.location || {};
  var query = loc.search;

  var formatNums = !!options.formatNums;
  var formatBools = !!options.formatBools;

  var returnValue = {};

  if (typeof query !== 'string') {
    return returnValue;
  }

  var trimmed = query.trim().replace(/^[?#&]/, '');

  if (!trimmed) {
    return returnValue;
  }

  var arr = trimmed.split('&');

  arr.forEach(function (x) {
    var subArr = x.split('=').map(function (y) {
      return y.trim();
    });
    if (subArr.length == 1) {
      returnValue[subArr[0]] = 'true';
    } else {
      returnValue[subArr[0]] = subArr[1];
    }
  });

  if (formatNums || formatBools) {
    for (var k in returnValue) {
      var isTrue = returnValue[k].toLowerCase() === 'true';
      var isFalse = returnValue[k].toLowerCase() === 'false';
      var asNum = parseFloat(returnValue[k]);
      var isNum = '' + asNum === returnValue[k];

      if (formatBools && isTrue) {
        returnValue[k] = true;
      } else if (formatBools && isFalse) {
        returnValue[k] = false;
      } else if (formatNums && isNum) {
        returnValue[k] = asNum;
      }
    }
  }

  return returnValue;
};

module.exports = {
  getIdFromPathname: getIdFromPathname,
  getPageName: getPageName,
  getWindowSearchArr: getWindowSearchArr,
  buildQueryString: buildQueryString,
  getQueryString: getQueryString,
  cleanUri: cleanUri,
  parseQueryString: parseQueryString
};