import { describe, expect, test } from 'vitest';
import {
  getMoveMap,
  sortArrayBasedOnMoveMap,
  sortMultipleArrays,
} from '../index';

const simpleArrayToSort = [1, 3, 4, 2];

const complexArrayToSort = [
  {
    item: 'socks',
    count: 2,
  },
  {
    item: 'jeans',
    count: 5,
  },
  {
    item: 'shirts',
    count: 3,
  },
];

describe('Test simple array sorting', () => {
  test('getMoveMap method should return correct move map', () => {
    const { moveMap } = getMoveMap(simpleArrayToSort, {
      sortOrder: 'asc',
    });

    const expectedMoveMap = [
      {
        from: 0,
        to: 0,
      },
      {
        from: 3,
        to: 1,
      },
      {
        from: 1,
        to: 2,
      },
      {
        from: 2,
        to: 3,
      },
    ];

    expect(moveMap).toStrictEqual(expectedMoveMap);
  });

  test('getMoveMap method should return correct sorted array', () => {
    const expectedSortedMasterArray = [1, 2, 3, 4];

    const { sortedMasterArray } = getMoveMap(simpleArrayToSort, {
      sortOrder: 'asc',
    });

    expect(sortedMasterArray).toStrictEqual(expectedSortedMasterArray);
  });

  test('Sorting an array directly using moveMap should sort correctly', () => {
    const sampleMoveMap = [
      {
        from: 0,
        to: 1,
      },
      {
        from: 1,
        to: 0,
      },
      {
        from: 2,
        to: 2,
      },
      {
        from: 3,
        to: 3,
      },
    ];
    expect(
      sortArrayBasedOnMoveMap(simpleArrayToSort, sampleMoveMap),
    ).toStrictEqual([3, 1, 4, 2]);
  });
});

describe('Test complex array sorting', () => {
  test('Object arrays should sort correctly', () => {
    const { sortedArrays } = sortMultipleArrays(
      complexArrayToSort,
      {
        sortOrder: 'asc',
        sortProp: 'count',
      },
      [['socksDrawer', 'jeansDrawer', 'shirtsDrawer']],
    );
    expect(sortedArrays[0]).toStrictEqual([
      'socksDrawer',
      'shirtsDrawer',
      'jeansDrawer',
    ]);
  });

  test('If no sort order is specified, it should be desc', () => {
    const { sortedArrays } = sortMultipleArrays(
      complexArrayToSort,
      {
        sortProp: 'count',
      },
      [['socksDrawer', 'jeansDrawer', 'shirtsDrawer']],
    );
    expect(sortedArrays[0]).toStrictEqual([
      'jeansDrawer',
      'shirtsDrawer',
      'socksDrawer',
    ]);
  });

  test('Sort keys are read once per item', () => {
    let reads = 0;
    const items = [3, 1, 2].map((score) =>
      Object.defineProperty({}, 'score', {
        get() {
          reads += 1;
          return score;
        },
      }),
    );

    getMoveMap(items, { sortProp: 'score', sortOrder: 'asc' });

    expect(reads).toBe(items.length);
  });

  test('Sparse master arrays keep related array positions aligned', () => {
    const masterArray = new Array<number>(3);
    masterArray[0] = 3;
    masterArray[2] = 1;

    const result = sortMultipleArrays(masterArray, { sortOrder: 'desc' }, [
      ['three', 'missing', 'one'],
    ]);

    expect(result.masterArray).toStrictEqual([undefined, 3, 1]);
    expect(result.sortedArrays[0]).toStrictEqual(['missing', 'three', 'one']);
  });
});

describe('Test error throwing', () => {
  test('Different length master sort array and arrays to sort should throw error', () => {
    expect(() => {
      sortMultipleArrays(
        simpleArrayToSort,
        {
          sortOrder: 'asc',
        },
        [[...simpleArrayToSort, 'additionalElement']],
      );
    }).toThrow();
  });

  test.each([
    ['source index outside array', [{ from: 4, to: 0 }]],
    ['destination outside array', [{ from: 0, to: 4 }]],
    [
      'duplicate destinations',
      [
        { from: 0, to: 0 },
        { from: 1, to: 0 },
      ],
    ],
    ['missing destination', [{ from: 1, to: 1 }]],
  ])('Invalid move map (%s) should throw', (_description, moveMap) => {
    expect(() => sortArrayBasedOnMoveMap([10, 20], moveMap)).toThrow();
  });

  test('Many related arrays should not exceed the argument limit', () => {
    const arraysToSort = Array.from({ length: 150_000 }, () => []);

    expect(() => sortMultipleArrays([], {}, arraysToSort)).not.toThrow();
  });
});
