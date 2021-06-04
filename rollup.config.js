import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import pkg from './package.json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const name = pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1);
const development = process.env.NODE_ENV !== 'production';

const overrides = !development ? {} : {
  noUnusedLocals: false,
  noUnusedParameters: false
};

const banner = `/*!
 * ${name} v${pkg.version}
 * (c) ${pkg.author}
 * Released under the ${pkg.license} License.
 */
`;

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  'fs',
  'path'
];

const plugins = [
  peerDepsExternal(),
  json(),
  resolve({ extensions }),
  commonjs(),
  typescript({
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      compilerOptions: overrides
    }
  }),
  babel({
    extensions,
    include: ['src/**/*'],
    runtimeHelpers: true
  })
];

export default [
  {
    // watch: { clearScreen: false },
    input: 'src/index.ts',
    external,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        banner,
        exports: 'named'
      },
      {
        file: pkg.module,
        format: 'esm',
        banner,
        exports: 'named'
      }
    ],
    plugins
  },
  {
    input: 'src/examples/repl.ts',
    external,
    plugins,
    output: [
      {
        file: 'dist/examples/repl.esm.js',
        format: 'esm',
        banner,
        exports: 'named'
      }
    ]
  },
  {
    input: 'src/examples/prompt.ts',
    external,
    plugins,
    output: [
      {
        file: 'dist/examples/prompt.esm.js',
        format: 'esm',
        banner,
        exports: 'named'
      }
    ]
  }
]
