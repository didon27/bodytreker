import {StyleSheet} from 'react-native';

import {DEVICE_WIDTH, DEVICE_HEIGHT} from 'constants';

export const styles = StyleSheet.create({
  container: {
    zIndex: 5,
    height: DEVICE_HEIGHT,
    position: 'absolute',
    bottom: 0,
    width: DEVICE_WIDTH,
  },
  pressable: {
    flex: 1,
    width: DEVICE_WIDTH,
    backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)',
    transform: [{translateY: 50}],
  },
});
