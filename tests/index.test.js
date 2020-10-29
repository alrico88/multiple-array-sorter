const {
  getMoveMap,
  sortMultipleArrays,
  sortArrayBasedOnMoveMap,
} = require('../index');

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
    const {moveMap} = getMoveMap(simpleArrayToSort, {
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

    const {sortedMasterArray} = getMoveMap(simpleArrayToSort, {
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
    expect(sortArrayBasedOnMoveMap(simpleArrayToSort, sampleMoveMap)).toStrictEqual([3, 1, 4, 2]);
  });
});

describe('Test complex array sorting', () => {
  test('Object arrays should sort correctly', () => {
    const {sortedArrays} = sortMultipleArrays(
      complexArrayToSort,
      {
        sortOrder: 'asc',
        sortProp: 'count',
      },
      [['socksDrawer', 'jeansDrawer', 'shirtsDrawer']]
    );
    expect(sortedArrays[0]).toStrictEqual([
      'socksDrawer',
      'shirtsDrawer',
      'jeansDrawer',
    ]);
  });

  test('If no sort order is specified, it should be desc', () => {
    const {sortedArrays} = sortMultipleArrays(
      complexArrayToSort,
      {
        sortProp: 'count',
      },
      [['socksDrawer', 'jeansDrawer', 'shirtsDrawer']]
    );
    expect(sortedArrays[0]).toStrictEqual([
      'jeansDrawer',
      'shirtsDrawer',
      'socksDrawer',
    ]);
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
        [...simpleArrayToSort, 'additionalElement']
      );
    }).toThrow();
  });
});
