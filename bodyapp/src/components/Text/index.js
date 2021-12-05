import React from 'react';
import {Text as RNText} from 'react-native';
import PropTypes from 'prop-types';

import {styles} from './styles';

const EN = {
  normal: 'Arial',
  medium: 'Arial',
  bold: 'Arial',
};

const getFont = type => {
  return type ? EN[type] : EN.normal;
};

const Text = ({style, ...props}) => {
  return (
    <RNText
      {...props}
      style={[
        {fontWeight: '400'},
        props.center && styles.center,
        props.left && styles.left,
        props.color && {color: props.color},
        props.right && styles.right,
        props.medium && {fontWeight: '500'},
        props.bold && {fontWeight: 'bold'},
        props.uppercase && styles.uppercase,
        props.capitalize && styles.capitalize,
        props.underline && styles.underline,
        props.size && {fontSize: props.size},
        props.mLeft && {marginLeft: props.mLeft},
        props.mRight && {marginRight: props.mRight},
        props.h1 && styles.h1,
        props.h2 && styles.h2,
        props.h3 && styles.h3,
        props.h4 && styles.h4,
        props.h5 && styles.h5,
        props.h6 && styles.h6,
        props.black && styles.black,
        props.white && styles.white,
        props.grey && styles.grey,
        props.beforeTrackerLabelColor && styles.beforeTrackerLabelColor,
        props.simpleGrey && styles.simpleGrey,
        props.labelColor && styles.labelColor,
        props.miniHeaderColor && styles.miniHeaderColor,
        props.buttonPurple && styles.buttonPurple,
        props.rgbaGrey && styles.rgbaGrey,
        props.mainColor && styles.mainColor,
        props.selectLabelColor && styles.selectLabelColor,
        props.mTop && {marginTop: props.mTop},
        props.mBottom && {marginBottom: props.mBottom},
        style,
      ]}
    />
  );
};

Text.propTypes = {
  style: PropTypes.any,
  center: PropTypes.bool,
  left: PropTypes.bool,
  right: PropTypes.bool,
  normal: PropTypes.bool,
  medium: PropTypes.bool,
  bold: PropTypes.bool,
  uppercase: PropTypes.bool,
  capitalize: PropTypes.bool,
  underline: PropTypes.bool,
  size: PropTypes.number,
  h1: PropTypes.bool,
  h2: PropTypes.bool,
  h3: PropTypes.bool,
  h4: PropTypes.bool,
  h5: PropTypes.bool,
  h6: PropTypes.bool,
  black: PropTypes.bool,
  white: PropTypes.bool,
  beforeTrackerLabelColor: PropTypes.bool,
  simpleGrey: PropTypes.bool,
  labelColor: PropTypes.bool,
  miniHeaderColor: PropTypes.bool,
  buttonPurple: PropTypes.bool,
  rgbaGrey: PropTypes.bool,
  mainColor: PropTypes.bool,
  selectLabelColor: PropTypes.bool,
  mTop: PropTypes.number,
  mBottom: PropTypes.number,
  grey: PropTypes.bool,
};

Text.defaultProps = {
  center: null,
  left: null,
  right: null,
  normal: null,
  medium: null,
  bold: null,
  uppercase: null,
  capitalize: null,
  underline: null,
  size: null,
  h1: null,
  h2: null,
  h3: null,
  h4: null,
  h5: null,
  h6: null,
  black: null,
  white: null,
  beforeTrackerLabelColor: null,
  simpleGrey: null,
  labelColor: null,
  miniHeaderColor: null,
  buttonPurple: null,
  rgbaGrey: null,
  mainColor: null,
  selectLabelColor: null,
  mTop: null,
  mBottom: null,
  grey: false,
};

export default Text;
