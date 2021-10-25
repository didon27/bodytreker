import React from 'react';
import {View as RNView} from 'react-native';
import PropTypes from 'prop-types';

import {styles} from './styles';

const View = (props) => {
  return (
    <RNView
      {...props}
      style={[
        props.flex && styles.flex,
        props.row && styles.row,
        props.sBetween && styles.sBetween,
        props.sAround && styles.sAround,
        props.fEnd && styles.fEnd,
        props.mTop && {marginTop: props.mTop},
        props.mBottom && {marginBottom: props.mBottom},
        props.centered && styles.centered,
        props.style && props.style
      ]}
    >
      {props.children}
    </RNView>
  );
};

View.propTypes = {
  flex: PropTypes.bool,
  row: PropTypes.bool,
  sBetween: PropTypes.bool,
  sAround: PropTypes.bool,
  children: PropTypes.any,
  mTop: PropTypes.number,
  mBottom: PropTypes.number,
  centered: PropTypes.bool,
  fEnd: PropTypes.bool,
  style: PropTypes.any
};

View.defaultProps = {
  row: false,
  sBetween: false,
  sAround: false,
  mTop: null,
  mBottom: null,
  centered: false,
  fEnd: false,
  style: null
};

export default View;
