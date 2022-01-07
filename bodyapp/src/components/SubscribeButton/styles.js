import {StyleSheet} from 'react-native';

import {colors} from 'colors';

export const styles = StyleSheet.create({
  btnBlock: {
    backgroundColor: '#4285f4',
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    height: 53,
    justifyContent: 'center',
    borderRadius: 8,
  },
  btnTxt: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
