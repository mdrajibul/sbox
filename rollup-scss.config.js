import scss from 'rollup-plugin-scss';

export default {
  input: 'src/scss.ts',
  plugins: [
    scss({
      output: true,
      output: 'dist/assets/sbox.css',
      failOnError: true,
    }),
  ],
};
