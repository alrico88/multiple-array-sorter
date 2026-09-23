export default {
  source: {
    entry: {
      index: './index.ts',
    },
  },
  lib: [
    {
      format: 'esm',
      bundle: true,
      dts: true,
    },
    {
      format: 'cjs',
      bundle: true,
    },
  ],
  output: {
    target: 'node',
  },
};
