import {colors} from 'colors';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  headerContainer: {
    backgroundColor: 'white',
    width: '100%',
    marginTop: -40,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: 0.5,
    borderColor: colors.lightGrey,
  },
  headerBtn: {
    marginTop: 0,
    width: null,
    height: 32,
    paddingHorizontal: 16,
  },
  counterBlock: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: colors.lightGrey,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
});
