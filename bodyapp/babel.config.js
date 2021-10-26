module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.android.js',
          '.android.tsx',
          '.ios.js',
          '.ios.tsx',
        ],
        alias: {
          components: './src/components',
          layouts: './src/layouts',
          colors: './src/colors',
          constants: './src/constants',
          images: './src/images',
          services: './src/services',
          enums: './src/enums',
          store: './src/store',
          helpers: './src/helpers',
          icons: './src/icons',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
