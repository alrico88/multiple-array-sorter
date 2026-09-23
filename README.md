# Multiple Array Sorter

Sort a master array and apply its ordering to related arrays.

## Installation

```sh
npm install multiple-array-sorter
```

The package ships both ES modules and CommonJS. `import` resolves to `dist/index.mjs`, `require` resolves to `dist/index.js`, and the same TypeScript declarations cover both.

```ts
// ESM
import { sortMultipleArrays } from 'multiple-array-sorter';
```

```js
// CommonJS
const { sortMultipleArrays } = require('multiple-array-sorter');
```

## Usage

```ts
import { sortMultipleArrays } from 'multiple-array-sorter';

const { masterArray, sortedArrays } = sortMultipleArrays(
  [
    { name: 'Ada', stats: { score: 10 } },
    { name: 'Linus', stats: { score: 30 } },
    { name: 'Grace', stats: { score: 20 } },
  ],
  { sortProp: 'stats.score', sortOrder: 'asc' },
  [['ada-row', 'linus-row', 'grace-row']],
);

// masterArray: Ada, Grace, Linus
// sortedArrays[0]: ['ada-row', 'grace-row', 'linus-row']
```

`sortOrder` defaults to `'desc'`. `sortProp` is optional; without it, values in the master array are compared directly. Nested properties use dot paths, such as `'stats.score'`. Every related array must have the same length as the master array or the function throws.

## Other exports

`getMoveMap` returns the sorted master array and the index map used to reorder related data:

```ts
import {
  getMoveMap,
  sortArrayBasedOnMoveMap,
} from 'multiple-array-sorter';

const { sortedMasterArray, moveMap } = getMoveMap([3, 1, 2], {
  sortOrder: 'asc',
});
// sortedMasterArray: [1, 2, 3]
// moveMap: [{ from: 1, to: 0 }, { from: 2, to: 1 }, { from: 0, to: 2 }]

sortArrayBasedOnMoveMap(['three', 'one', 'two'], moveMap);
// ['one', 'two', 'three']
```

All functions and the `SortParams`, `MoveMapItem`, and `SortResult` types are named exports. `sortMultipleArrays` is also the default export (`import sortMultipleArrays from 'multiple-array-sorter'`). TypeScript declarations are included.
