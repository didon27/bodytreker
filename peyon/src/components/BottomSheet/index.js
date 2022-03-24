import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {Pressable, Animated} from 'react-native';

import {DEVICE_HEIGHT} from 'constants';

import {styles} from './styles';

const BottomSheet = ({isOn, children, onCancel}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOn) {
      showSheet();
    }
    if (!isOn) {
      hideSheet();
    }
  }, [isOn]);

  const hideSheet = () => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true
    }).start();
  };

  const showSheet = () => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true
    }).start();
  };

  return (
    <Animated.View
      style={
        [styles.container,
          {transform: [{translateY: anim.interpolate({outputRange: [DEVICE_HEIGHT, 0], inputRange: [0, 1]})}
          ]}
        ]}>
      <Pressable style={styles.pressable} onPress={onCancel} />
      {children}
    </Animated.View>
  );
};

BottomSheet.propTypes = {
  isOn: PropTypes.bool,
  children: PropTypes.any,
  onCancel: PropTypes.func
};

BottomSheet.defaultProps = {
  isOn: false,
  onCancel: null
};

export default BottomSheet;
