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
  const uniqueLengths = new Set();
  for (const array of arrays) {
    uniqueLengths.add(array.length);
    if (uniqueLengths.size > 1) {
      return false;
    }
  }
  return true;
}

/**
 * @typedef SortParams
 * @property {string} [sortProp] Property to sort by, if value to sort by is object. Supports nested props, like 'propA.propB'
 * @property {'asc'|'desc'} [sortOrder="desc"] Whether to use ascending or descending order to sort
 */

/**
 * @typedef SortResult
 * @property {any[]} masterArray
 * @property {any[][]} sortedArrays
 */

/**
 * @typedef MoveMapItem
 * @property {number} from
 * @property {number} to
 */

/**
 * Sorts master array and returns moveMap
 *
 * @param {any[]} arrayToSortBy
 * @param {SortParams} sortParams
 * @returns {{moveMap: MoveMapItem[], sortedMasterArray: any[]}}
 */
function getMoveMap(arrayToSortBy, sortParams) {
  const indexKey = uniqueId('originalIndex_');
  const {sortProp, sortOrder = 'desc'} = sortParams;
  const masterArray = arrayToSortBy.map((d, index) => ({
    [indexKey]: index,
    value: d,
  }));

  const sortingFunc = sortProp ? (d) => get(d.value, sortProp) : (d) => d.value;
  const sortedMasterArray = orderBy(masterArray, sortingFunc, sortOrder);

  const moveMap = sortedMasterArray.reduce((agg, item, index) => {
    agg.push({
      from: item[indexKey],
      to: index,
    });
    return agg;
  }, []);
  return {
    moveMap,
    sortedMasterArray: sortedMasterArray.map((d) => d.value),
  };
}

/**
 * Sorts array based on moveMap
 *
 * @param {any[]} array
 * @param {MoveMapItem[]} moveMap
 * @returns {any[]}
 */
function sortArrayBasedOnMoveMap(array, moveMap) {
  return moveMultiIndex(array, moveMap);
}

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

  const {moveMap, sortedMasterArray} = getMoveMap(arrayToSortBy, sortParams);

  return {
    masterArray: sortedMasterArray,
    sortedArrays: arraysToSort.map((array) =>
      sortArrayBasedOnMoveMap(array, moveMap)),
  };
}

module.exports = sortMultipleArrays;
module.exports.sortMultipleArrays = sortMultipleArrays;
module.exports.sortArrayBasedOnMoveMap = sortArrayBasedOnMoveMap;
module.exports.getMoveMap = getMoveMap;
