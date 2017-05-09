import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';

export default {
  entry: 'src/index.js',
  plugins: [
    replace({
      'process.env.NODE_DEBUG': false,
      'process.env.NODE_ENV': '"production"'
    }),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: ['es2015-rollup', 'stage-0', 'react']
    })
  ],
  external: ['react', 'prop-types'],
  exports: 'named',
  globals: {
    react: 'React',
    'prop-types': 'PropTypes'
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
