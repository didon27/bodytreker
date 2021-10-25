import {StyleSheet} from 'react-native';

import {colors} from '_colors';

export const styles = StyleSheet.create({
  center: {
    textAlign: 'center'
  },
  left: {
    textAlign: 'left'
  },
  right: {
    textAlign: 'right'
  },
  uppercase: {
    textTransform: 'uppercase'
  },
  capitalize: {
    textTransform: 'capitalize'
  },
  underline: {
    textDecorationLine: 'underline'
  },
  h1: {
    fontSize: 32
  },
  h2: {
    fontSize: 24
  },
  h3: {
    fontSize: 19
  },
  h4: {
    fontSize: 16
  },
  h5: {
    fontSize: 13
  },
  h6: {
    fontSize: 10
  },
  white: {
    color: colors.white
  },
  grey: {
    color: colors.grey
  }
});
