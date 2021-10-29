import {StyleSheet} from 'react-native';

import {colors} from 'colors';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 16
  },
  inner: {
    paddingTop: 32
  },
  title: {
    fontSize: 28,
    color: colors.blackLabelBold,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    color: colors.grey,
    fontWeight: '400',
    marginBottom: 20,
    textAlign: 'center'
  },
  errorText: {
    alignSelf: 'center',
    textAlign: 'center',
    color: colors.errorColor
  },
  modalContainer: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    height: 160,
    borderRadius: 16,
    padding: 20,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTxt: {
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 10
  }
});
