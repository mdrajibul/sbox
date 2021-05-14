import cssbundle from 'rollup-plugin-css-bundle';

export default {
  input: 'dist/esm/index.js',
  output: {
    file: 'dist/umd/sbox.js',
    format: 'umd',
    sourcemap: true,
    name: 'SBOX',
  },
  plugins: [
    cssbundle({
      output: 'dist/assets/sbox.css',
    }),
  ],
};
