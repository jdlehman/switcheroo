import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.js',
  plugins: [
    replace({
      'process.env.NODE_DEBUG': false,
      'process.env.NODE_ENV': '"production"'
    }),
    resolve({ jsnext: true, main: true }),
    commonjs({ include: 'node_modules/**' }),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: ['es2015-rollup', 'stage-0', 'react']
    })
  ],
  external: ['react'],
  exports: 'named',
  globals: {
    react: 'React'
  },
  name: 'switcheroo',
  moduleId: 'switcheroo',
  output: [
    { format: 'umd', file: 'dist/switcheroo.umd.js' },
    { format: 'iife', file: 'dist/switcheroo.browser.js' },
    { format: 'amd', file: 'dist/switcheroo.amd.js' },
    { format: 'cjs', file: 'dist/switcheroo.cjs.js' },
    { format: 'es', file: 'dist/switcheroo.es-modules.js' }
  ]
};
