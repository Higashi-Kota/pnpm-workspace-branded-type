import { defineConfig } from '@rslib/core'

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'
const isStaging = process.env.NODE_ENV === 'staging'

export default defineConfig({
  lib: [
    {
      source: {
        entry: {
          'components/index': 'src/components/index.ts',
        },
        tsconfigPath: './tsconfig.json',
      },
      format: 'esm',
      syntax: 'esnext',
      dts: true,
      bundle: true,
      tools: {
        swc: {
          jsc: {
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
          },
        },
      },
      output: {
        minify: isProduction,
        sourceMap: isDevelopment || isTest || isStaging,
        target: 'web',
        externals: [/^@ecommerce\//, 'react', 'react-dom', 'react/jsx-runtime'],
      },
    },
  ],

  output: {
    distPath: {
      root: 'dist',
    },
    cleanDistPath: 'auto',
  },

  plugins: [
    {
      name: 'build-success',
      setup(api) {
        api.onAfterBuild(() => {
          console.log('✅ @ecommerce/order built successfully!')
        })
      },
    },
  ],
})
