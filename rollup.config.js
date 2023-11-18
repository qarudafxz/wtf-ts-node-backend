import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import jsonResolver from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import alias from '@rollup/plugin-alias'

export default {
  input: 'index.ts', // Entry point for your TypeScript code
  output: {
    dir: './api', // Output JavaScript file
    format: 'es',
    inlineDynamicImports: true,
  },
  external: [
    'bcrypt',
    '@sentry/node',
    'cors',
    'bcrypt',
    'body-parser',
    'cookie',
    'crypto-js',
    'dotenv',
    'express',
    'jsonwebtoken',
    'morgan',
    'nodemailer',
    'pg',
    'pusher',
    'uuid',
  ],
  plugins: [
    resolve({ preferBuiltins: true }), // Resolve node_modules dependencies
    commonjs(), // Convert CommonJS modules to ES modules
    jsonResolver(),
    typescript(), // Compile TypeScript,
    alias({ entries: [{ find: /^@\/(.*)/, replacement: './$1' }] }),
    terser(),
  ],
}
