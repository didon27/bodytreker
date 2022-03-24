import React from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator} from 'react-native';

import {colors} from 'colors';

import {styles} from './styles';

const Loader = (props) => {
  return <ActivityIndicator style={styles.loader} {...props} />;
};

Loader.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string
};

Loader.defaultProps = {
  color: colors.white,
  size: 'small'
};

export default Loader;
