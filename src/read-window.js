'use strict';

const { isObjectLiteral } = require('conjunction-junction');
const queryString         = require('query-string');

const getIdFromPathname = (integer=true) => {
  const pathname = typeof window !== 'undefined' && window.location && typeof window.location.pathname === 'string' ?
    window.location.pathname : '' ;
  const arr = pathname.split('/');
  const _id = arr[arr.length-1];
  const id = integer ? parseInt(_id,10) : _id ;
  return id;
};

const getPageName = () => {
  const pathname = typeof window !== 'undefined' && window.location && typeof window.location.pathname === 'string' ?
    window.location.pathname : '' ;
  const arr = pathname.split('/');
  const page = arr[1];
  return page;
};

const getWindowSearchArr = (int) => {
  if(window && window.location && typeof window.location.search === 'string'){
    const search = window.location.search;
    const split = search.split('?');
    const searchArr = typeof split[1] === 'string' ? split[1].split(',') : [] ;
    const finalArr = int ?
      searchArr.map(t=>parseInt(t,10)) :
      searchArr;
    return finalArr;
  }
  return [];
};

const buildQueryString = options => {
  const queryArr = [];
  if(isObjectLiteral(options)){
    for(let key in options){
      queryArr.push(`${key}=${options[key]}`);
    }
  }
  const query = queryArr.length > 0 ?
    `?${queryArr.join('&')}` : '' ;
  return query;
};

const getQueryString = () => {
  // read global window object
  // return a query string as-is (without ?) if exists
  // if does not exist, return empty string
  if(typeof window === 'undefined'){
    return '';
  }
  const queryString = 
    window.location && 
    typeof window.location.search === 'string' && 
    window.location.search.length > 1 ?
      window.location.search.slice(1,window.location.search.length) :
      '';
  return queryString;
};

const cleanUri = () => {
  const uri = typeof window !== 'undefined' && 
    window.location && typeof window.location.toString === 'function' ?
    window.location.toString() : '';
  const qIndex = uri.indexOf('?');
  if (qIndex > 0) {
    const cleanUri = uri.substring(0, qIndex);
    window.history.replaceState({}, document.title, cleanUri);
  }
};

const parseQueryString = () => {
  const win = typeof window !== 'undefined' ? window : {} ;
  const loc = win.location || {} ;
  const search = loc.search;
  const parsed = queryString.parse(search);
  const parsedAsObject = {}; // without this extra step, parsed is not an instanceof Object and thus fails isObjectLiteral()
  for(let k in parsed){
    parsedAsObject[k] = parsed[k];
  }
  return parsedAsObject;
};

module.exports = {
  getIdFromPathname,
  getPageName,
  getWindowSearchArr,
  buildQueryString,
  getQueryString,
  cleanUri,
  parseQueryString,
};