import {colors} from 'colors';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  headerContainer: {
    backgroundColor: 'white',
    width: '100%',
    marginTop: -40,
    paddingTop: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerBtn: {
    marginTop: 0,
    width: null,
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  counterBlock: {
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: colors.lightGrey,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  modalControlButton: {
    backgroundColor: colors.white,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14
}
});
