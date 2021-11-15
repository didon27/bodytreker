import {StyleSheet} from 'react-native';

import {colors} from 'colors';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 48,
    fontSize: 16,
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 4,
    paddingLeft: 10,
    justifyContent: 'center'
  },
  textBoxBtnHolder: {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  textBox: {
    fontSize: 18,
    alignSelf: 'stretch',
    height: 45,
    paddingRight: 45,
    color: colors.black,
    paddingLeft: 8,
    // borderBottomWidth: 2,
    paddingVertical: 0,
    // borderBottomColor: colors.turquoise
  },
  errorMsg: {
    color: colors.errorColor
  },
  errorContainer: {
    position: 'absolute',
    bottom: -20,
    width: '100%'
  },
  visibilityBtn: {
    position: 'absolute',
    right: 0,
    height: 23,
    width: 35,
  },
  btnImage: {
    height: '100%',
    width: '100%'
  }
});
