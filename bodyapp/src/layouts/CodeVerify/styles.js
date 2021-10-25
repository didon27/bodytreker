import {StyleSheet} from 'react-native';

import {colors} from '_colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    justifyContent: 'space-between'
  },
  resendCodeTxt: {
    marginTop: 24,
    alignSelf: 'center',
    color: colors.turquoise,
    fontSize: 17,
    fontWeight: '600'
  },
  codeFieldRoot: {
    marginTop: 50,
    justifyContent: 'center',
    paddingBottom: 10
  },
  cellRoot: {
    height: 50,
    width: 65,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: colors.lightBordered,
    borderRightWidth: 1
  },
  focusCell: {
    borderBottomColor: colors.turquoise
  },
  cellText: {
    color: colors.black,
    fontSize: 30
  },
  inner: {
    paddingTop: 32
  },
  title: {
    fontSize: 28,
    color: '#222B45',
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center'
  },
  subTitle: {
    fontSize: 16,
    color: colors.grey,
    fontWeight: '400',
    marginBottom: 20,
    textAlign: 'center'
  },
  bottomLine: {
    borderBottomWidth: 1,
    borderColor: colors.lightBordered,
    width: 250,
    alignSelf: 'center'
  },
  errorText: {
    alignSelf: 'center',
    textAlign: 'center',
    color: colors.errorColor
  },
  resetText: {
    marginTop: 10,
    alignSelf: 'center',
    textAlign: 'center',
    color: 'green'
  }
});
