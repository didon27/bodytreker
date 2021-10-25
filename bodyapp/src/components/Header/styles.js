import {StyleSheet} from 'react-native';

import {colors} from '_colors';

export default StyleSheet.create({
  title: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    height: 40,
    justifyContent: 'center'
  },
  titleTxt: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.blackLabel
  },
  btnBack: {
    zIndex: 999,
    height: 40,
    width: 40,
    marginLeft: 20,
    backgroundColor: colors.turquoise,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  }
});
