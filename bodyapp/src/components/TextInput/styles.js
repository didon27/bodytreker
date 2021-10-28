import {StyleSheet} from 'react-native';

import {colors} from 'colors';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 5,
    height: 56,
    backgroundColor: colors.inputBackground
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
    borderBottomWidth: 2,
    paddingVertical: 0,
    borderBottomColor: colors.turquoise
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
    right: 3,
    height: 40,
    width: 35,
    padding: 5
  },
  btnImage: {
    height: '100%',
    width: '100%'
  }
});
