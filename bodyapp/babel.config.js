module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'babel-plugin-root-import',
      {
        paths: [
          {
            rootPathSuffix: './src/components',
            rootPathPrefix: '_components'
          },
          {
            rootPathSuffix: './src/layouts',
            rootPathPrefix: '_layouts'
          },
          {
            rootPathSuffix: './src/colors',
            rootPathPrefix: '_colors'
          },
          {
            rootPathSuffix: './src/constants',
            rootPathPrefix: '_constants'
          },
          {
            rootPathSuffix: './src/images',
            rootPathPrefix: '_images'
          },
          {
            rootPathSuffix: './src/services',
            rootPathPrefix: '_services'
          },
          {
            rootPathSuffix: './src/enums',
            rootPathPrefix: '_enums'
          },
          {
            rootPathSuffix: './src/store',
            rootPathPrefix: '_store'
          },
          {
            rootPathSuffix: './src/helpers',
            rootPathPrefix: '_helpers'
          },
          {
            rootPathSuffix: './src/icons',
            rootPathPrefix: '_icons'
          }
        ]
      }
    ]
  ], 
  env: {
    production: {
      plugins: [
        [
          'babel-plugin-root-import',
          {
            paths: [
              {
                rootPathSuffix: './src/components',
                rootPathPrefix: '_components'
              },
              {
                rootPathSuffix: './src/layouts',
                rootPathPrefix: '_layouts'
              },
              {
                rootPathSuffix: './src/colors',
                rootPathPrefix: '_colors'
              },
              {
                rootPathSuffix: './src/constants',
                rootPathPrefix: '_constants'
              },
              {
                rootPathSuffix: './src/images',
                rootPathPrefix: '_images'
              },
              {
                rootPathSuffix: './src/services',
                rootPathPrefix: '_services'
              },
              {
                rootPathSuffix: './src/enums',
                rootPathPrefix: '_enums'
              },
              {
                rootPathSuffix: './src/store',
                rootPathPrefix: '_store'
              },
              {
                rootPathSuffix: './src/helpers',
                rootPathPrefix: '_helpers'
              },
              {
                rootPathSuffix: './src/icons',
                rootPathPrefix: '_icons'
              }
            ]
          }
        ]
      ]
    }
  }
};

