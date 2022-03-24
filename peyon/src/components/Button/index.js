import React from 'react';
import { ActivityIndicator, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';

import Text from '../Text';
import {colors} from 'colors';

import {styles} from './styles';

const Button = (props) => {
  return (
    <TouchableOpacity
      disabled={props.loading || props.disabled}
      style={[styles.btnBlock, props.style, props.disabled && {opacity: 0.6}]}
      onPress={props.onPress}
    >
      {props.loading && <ActivityIndicator color={colors.white} />}
      {!props.loading && <Text style={[styles.btnTxt, props.textStyle]}>{props.text}</Text>}
    </TouchableOpacity>
  );
};

Button.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onPress: PropTypes.func,
  text: PropTypes.string,
  textStyle: PropTypes.object,
  style: PropTypes.object
};

Button.defaultProps = {
  disabled: false,
  loading: false,
  onPress: null,
  style: {},
  text: null,
  textStyle: {}
};

export default Button;
