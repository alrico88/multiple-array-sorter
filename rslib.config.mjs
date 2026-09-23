export default {
  source: {
    entry: {
      index: './index.ts',
    },
  },
  lib: [
    {
      format: 'cjs',
      bundle: true,
      dts: true,
    },
  ],
  output: {
    target: 'node',
  },
};
