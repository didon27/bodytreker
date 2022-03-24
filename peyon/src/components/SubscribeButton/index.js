import React from 'react';
import {TouchableOpacity, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';

import Text from '../Text';
import {colors} from 'colors';

import {styles} from './styles';

const SubscribeButton = props => {
  return (
    <TouchableOpacity
      disabled={props.loading || props.disabled}
      style={[
        styles.btnBlock,
        props.style,
        props.disabled && {opacity: 0.6},
        props.subscribe && {
          borderWidth: 1,
          borderColor: colors.lightGrey,
          backgroundColor: 'transparent',
        },
      ]}
      onPress={props.onPress}>
      {props.loading && (
        <ActivityIndicator
          color={!props.subscribe ? colors.white : colors.mainBlue}
        />
      )}
      {!props.loading && (
        <Text
          color={!props.subscribe && colors.white}
          style={[styles.btnTxt, props.textStyle]}>
          {props.text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default SubscribeButton;
