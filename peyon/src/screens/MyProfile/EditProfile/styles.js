import { DEVICE_WIDTH } from 'constants';
import { Dimensions, StyleSheet } from 'react-native';
import { colors } from 'colors';

export default StyleSheet.create({
  input: {
    marginTop: 16,
    borderRadius: 0,
    borderBottomWidth: 1,
    paddingLeft: 0,
    borderBottomColor: colors.lightGrey,
  },
  camera: {
    position: 'absolute',
    backgroundColor: colors.mainBlue,
    borderWidth: 2,
    borderColor: colors.lightGrey,
    width: 40,
    height: 40,
    bottom: 0,
    right: -10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    zIndex: 9999,
  },
  inputContainer: { borderColor: colors.errorColor, backgroundColor: '#f4f4f4', height: 40, borderRadius: 10, paddingHorizontal: 16, },
  inputDescriptionContainer: { backgroundColor: '#f4f4f4', paddingTop: 8, paddingBottom: 16, borderRadius: 10, paddingHorizontal: 16, },
});
