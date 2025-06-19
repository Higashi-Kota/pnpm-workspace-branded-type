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
          index: 'src/index.ts',
        },
        tsconfigPath: './tsconfig.json',
      },
      format: 'esm',
      syntax: 'esnext',
      dts: true,
      bundle: true,
      output: {
        minify: isProduction,
        sourceMap: isDevelopment || isTest || isStaging,
        target: 'web',
        externals: [/^@ecommerce\//],
      },
      tools: {
        rspack: (config) => {
          // import.meta.env の置換を無効化
          if (config.plugins) {
            config.plugins = config.plugins.filter((plugin) => {
              // DefinePluginを除去
              return !(
                plugin?.constructor &&
                plugin.constructor.name === 'DefinePlugin'
              )
            })
          }
          return config
        },
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
          console.log('✅ @ecommerce/config built successfully!')
        })
      },
    },
  ],
})
