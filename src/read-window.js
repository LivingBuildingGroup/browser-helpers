'use strict';

const { isObjectLiteral } = require('conjunction-junction');

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

const getWindowSearchArr = int => {
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

const parseQueryString = (options={}) => {
  const win = typeof window !== 'undefined' ? window : {} ;
  const loc = win.location || {} ;
  const query = loc.search;

  const formatNums = !!options.formatNums;
  const formatBools = !!options.formatBools;

  const returnValue = {};

  if (typeof query !== 'string') {
		return returnValue;
	}

	const trimmed = query.trim().replace(/^[?#&]/, '');

	if (!trimmed) {
		return returnValue;
	}

  const arr = trimmed.split('&');

  arr.forEach(x=>{
    const subArr = x.split('=').map(y=>y.trim());
    if(subArr.length == 1){
      returnValue[subArr[0]] = 'true';
    } else {
      returnValue[subArr[0]] = subArr[1];
    }
  });

  if(formatNums || formatBools){
    for(let k in returnValue){
      const isTrue = returnValue[k].toLowerCase() === 'true';
      const isFalse = returnValue[k].toLowerCase() === 'false';
      const asNum = parseFloat(returnValue[k])
      const isNum = `${asNum}` === returnValue[k];

      if(formatBools && isTrue){
        returnValue[k] = true;
      } else if(formatBools && isFalse){
        returnValue[k] = false;
      } else if(formatNums && isNum){
        returnValue[k] = asNum;
      }
    }
  }

  return returnValue;
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