import {StyleSheet} from 'react-native';

import {colors} from 'colors';

export default StyleSheet.create({
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
    zIndex: 9999,
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  centerBlock: {
    padding: 20,
    backgroundColor: '#202124cc',
    borderRadius: 20,
    marginTop: 20,
  },
  background: {width: '100%', height: '100%', zIndex: 0},
  saveMeContainer: {
    borderWidth: 1,
    height: 16,
    width: 16,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveMeBlock: {width: 6, height: 6, backgroundColor: 'white'}
});
