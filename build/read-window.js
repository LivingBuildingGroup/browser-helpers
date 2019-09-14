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

module.exports = {
  getIdFromPathname: getIdFromPathname,
  getPageName: getPageName,
  getWindowSearchArr: getWindowSearchArr,
  buildQueryString: buildQueryString,
  getQueryString: getQueryString
};