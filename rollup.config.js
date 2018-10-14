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
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from'
      ]
    })
  ],
  external: ['react'],
  output: [
    {
      format: 'umd',
      file: 'dist/switcheroo.umd.js',
      exports: 'named',
      name: 'switcheroo',
      globals: { react: 'React' }
    },
    {
      format: 'iife',
      file: 'dist/switcheroo.browser.js',
      exports: 'named',
      name: 'switcheroo',
      globals: { react: 'React' }
    },
    {
      format: 'amd',
      file: 'dist/switcheroo.amd.js',
      exports: 'named',
      name: 'switcheroo',
      globals: { react: 'React' }
    },
    {
      format: 'cjs',
      file: 'dist/switcheroo.cjs.js',
      exports: 'named',
      name: 'switcheroo',
      globals: { react: 'React' }
    },
    {
      format: 'es',
      file: 'dist/switcheroo.es-modules.js',
      exports: 'named',
      name: 'switcheroo',
      globals: { react: 'React' }
    }
  ]
};
