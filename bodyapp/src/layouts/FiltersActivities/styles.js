import {colors} from 'colors';
import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  categoryText: {
    fontSize: 16,
    fontWeight: '400',
  },
  categoryBlock: {
    opacity: 0.16,
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: -1,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
  },
  fakeText: {
    fontSize: 16,
    fontWeight: '400',
    color: 'transparent',
  },
  categoryContainer: {
    marginRight: 10,
    height: 32,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginTop: 12,
  },

});
