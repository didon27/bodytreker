import {StyleSheet} from 'react-native';

import {colors} from 'colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  resendCodeTxt: {
    alignSelf: 'center',
    color: 'grey',
    fontSize: 15,
    fontWeight: '600',
  },
  codeFieldRoot: {
    justifyContent: 'center',
    paddingBottom: 4,
  },
  cellRoot: {
    height: 50,
    width: 65,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightBordered,
    borderRadius: 14,
    marginRight: 10,
    borderWidth: 1,
  },
  focusCell: {
    borderBottomColor: colors.turquoise,
  },
  cellText: {
    color: colors.black,
    fontSize: 30,
  },
  title: {
    fontSize: 28,
    color: '#222B45',
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    color: colors.grey,
    fontWeight: '400',
    textAlign: 'center',
  },
  errorText: {
    alignSelf: 'center',
    textAlign: 'center',
    color: colors.errorColor,
    marginBottom: -17,
  },
  resetText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    color: 'green',
  },
  dimmer: {
    width: '100%',
    height: '100%',
    opacity: 0.4,
    zIndex: 2,
    backgroundColor: 'black',
    position: 'absolute',
  },
  centerContainer: {
    position: 'absolute',
    zIndex: 9,
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  centerBlock: {
    padding: 20,
    backgroundColor: '#202124cc',
    borderRadius: 20,
    marginTop: 20,
  },
  background: {width: '100%', height: '100%', zIndex: 0},
});
