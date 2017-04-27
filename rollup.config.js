import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'src/index.js',
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
      presets: [['es2015', { modules: false }], 'stage-0', 'react']
    })
  ],
  external: ['react'],
  globals: {
    react: 'React'
  },
  moduleName: 'switcheroo',
  moduleId: 'switcheroo',
  targets: [
    { format: 'umd', dest: 'dist/switcheroo.umd.js' },
    { format: 'iife', dest: 'dist/switcheroo.browser.js' },
    { format: 'amd', dest: 'dist/switcheroo.amd.js' },
    { format: 'cjs', dest: 'dist/switcheroo.cjs.js' },
    { format: 'es', dest: 'dist/switcheroo.es-modules.js' }
  ]
};
