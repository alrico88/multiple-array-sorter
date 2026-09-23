import { orderBy } from 'es-toolkit';

export interface SortParams {
  /** Object property path used as the sort key. */
  sortProp?: string;
  /** Sort direction; defaults to descending. */
  sortOrder?: 'asc' | 'desc';
}

export interface MoveMapItem {
  /** Index in the original array. */
  from: number;
  /** Index in the sorted array. */
  to: number;
}

export interface SortResult<T, U> {
  /** The master array in its new order. */
  masterArray: T[];
  /** Related arrays reordered to match the master array. */
  sortedArrays: U[][];
}

interface MoveMapResult<T> {
  moveMap: MoveMapItem[];
  sortedMasterArray: T[];
}

function checkLengths(
  masterArray: unknown[],
  arraysToSort: unknown[][],
): boolean {
  return arraysToSort.every((array) => array.length === masterArray.length);
}

/** Sorts the master array and creates the map for reordering related arrays.
 * @param arrayToSortBy Values that determine the new order.
 * @param sortParams Property path and direction used to compare values.
 */
function getMoveMap<T>(
  arrayToSortBy: T[],
  sortParams: SortParams,
): MoveMapResult<T> {
  const { sortProp, sortOrder = 'desc' } = sortParams;
  const path = sortProp?.split('.');
  const indexedValues = Array.from(arrayToSortBy, (value, index) => ({
    value,
    index,
    sortValue: path ? getSortValue(value, path) : value,
  }));

  const sortedMasterArray = orderBy(indexedValues, ['sortValue'], [sortOrder]);

  const moveMap = sortedMasterArray.map((item, to) => ({
    from: item.index,
    to,
  }));
  return {
    moveMap,
    sortedMasterArray: sortedMasterArray.map((item) => item.value),
  };
}

/** Returns the value at a dot-separated path, or undefined when the path is absent.
 * @param value Value to read from.
 * @param path Segments of the property path.
 */
function getSortValue(value: unknown, path: string[]): unknown {
  let current = value;
  for (const key of path) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

/** Reorders an array using a map returned by getMoveMap.
 * @param array Values to reorder.
 * @param moveMap Original and sorted index pairs.
 */
function sortArrayBasedOnMoveMap<T>(array: T[], moveMap: MoveMapItem[]): T[] {
  validateMoveMap(array.length, moveMap);
  return applyMoveMap(array, moveMap);
}

function validateMoveMap(arrayLength: number, moveMap: MoveMapItem[]): void {
  if (!Array.isArray(moveMap) || moveMap.length !== arrayLength) {
    throw new Error('Move map must contain one entry per array item');
  }

  const fromIndexes = new Set<number>();
  const toIndexes = new Set<number>();
  for (const { from, to } of moveMap) {
    if (
      !Number.isInteger(from) ||
      !Number.isInteger(to) ||
      from < 0 ||
      from >= arrayLength ||
      to < 0 ||
      to >= arrayLength ||
      fromIndexes.has(from) ||
      toIndexes.has(to)
    ) {
      throw new Error('Invalid move map');
    }
    fromIndexes.add(from);
    toIndexes.add(to);
  }
}

function applyMoveMap<T>(array: T[], moveMap: MoveMapItem[]): T[] {
  const reordered = new Array<T>(array.length);
  for (const { from, to } of moveMap) {
    reordered[to] = array[from];
  }
  return reordered;
}

/** Sorts a master array and reorders each related array to match.
 * @param arrayToSortBy Values that determine the new order.
 * @param sortParams Property path and direction used to compare values.
 * @param arraysToSort Related arrays whose positions follow the master array.
 */
function sortMultipleArrays<T, U>(
  arrayToSortBy: T[],
  sortParams: SortParams,
  arraysToSort: U[][],
): SortResult<T, U> {
  if (!checkLengths(arrayToSortBy, arraysToSort)) {
    throw new Error('Arrays are not the same length');
  }

  const { moveMap, sortedMasterArray } = getMoveMap(arrayToSortBy, sortParams);

  return {
    masterArray: sortedMasterArray,
    sortedArrays: arraysToSort.map((array) => applyMoveMap(array, moveMap)),
  };
}

export { getMoveMap, sortArrayBasedOnMoveMap, sortMultipleArrays };
export default sortMultipleArrays;
