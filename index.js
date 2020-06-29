const orderBy = require('lodash/orderBy');
const uniqueId = require('lodash/uniqueId');
const get = require('lodash/get');
const {moveMultiIndex} = require('move-position');

/**
 * Checks if all arrays are the same size
 *
 * @param {any[][]} arrays Arrays to check length of
 * @returns {boolean}
 */
function checkLengths(...arrays) {
  let uniqueLengths = new Set();
  for (let array of arrays) {
    uniqueLengths.add(array.length);
    if (uniqueLengths.size > 1) {
      return false;
    }
  }
  return true;
}

/**
 * @typedef SortParams
 * @property {string} sortProp
 * @property {'asc'|'desc'} sortOrder
 */

/**
 * @typedef SortResult
 * @property {any[]} masterArray
 * @property {any[][]} sortedArrays
 */

/**
 * Sorts multiple arrays based on master array sort order
 *
 * @param {any[]} arrayToSortBy Master array to sort the others arrays by
 * @param {SortParams} sortParams Parameters to sort master array
 * @param {any[][]} arraysToSort Arrays to sort
 * @returns {SortResult} The sorted master array and the sorted resulting arrays
 */
function sortMultipleArrays(arrayToSortBy, sortParams, arraysToSort) {
  if (!checkLengths(arrayToSortBy, ...arraysToSort)) {
    throw new Error('Arrays are not the same length');
  }
  const indexKey = uniqueId('originalIndex_');
  const {sortProp, sortOrder = 'desc'} = sortParams;
  const masterArray = arrayToSortBy.map((d, index) => ({
    [indexKey]: index,
    value: d,
  }));
  let sortedMasterArray;
  if (sortProp) {
    sortedMasterArray = orderBy(
      masterArray,
      (d) => get(d.value, sortProp),
      sortOrder
    );
  } else {
    sortedMasterArray = orderBy(masterArray, (d) => d.value, sortOrder);
  }
  const moveMap = [];
  sortedMasterArray.forEach((item, index) => {
    moveMap.push({
      from: item[indexKey],
      to: index,
    });
  });
  const sortedArrays = [];
  arraysToSort.forEach((array) => {
    sortedArrays.push(moveMultiIndex(array, moveMap));
  });
  return {
    masterArray: sortedMasterArray.map((d) => d.value),
    sortedArrays,
  };
}

module.exports = sortMultipleArrays;
