import {StyleSheet} from 'react-native';

import {colors} from 'colors';

export default StyleSheet.create({
  btnBlock: {
    paddingVertical: 8,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  languageBlock: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  check: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.mainBlue,
  },
  languageContainer: {
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    paddingBottom: 16,
    marginBottom: 10,
    borderColor: colors.lightGrey,
  },
  goBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 999,
    width: 40,
    height: 40,
  },
  titleCategory: {
    backgroundColor: '#f6f6f6',
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  editProfile: {
    borderRadius: 20,
    height: 40,
    width: null,
    paddingHorizontal: 16,
  },
  logout: {
    paddingHorizontal: 16,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
