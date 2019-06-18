'use strict';

const { isObjectLiteral } = require('conjunction-junction');

const getIdFromPathname = (integer = true) => {
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

module.exports = {
  getIdFromPathname,
  getPageName,
  getWindowSearchArr,
  buildQueryString,
};