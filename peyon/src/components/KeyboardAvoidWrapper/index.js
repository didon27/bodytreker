import React from 'react';
import PropTypes from 'prop-types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {colors} from 'colors';

const KeyboardAvoidWrapper = props => {
  return (
    <KeyboardAwareScrollView
      style={{backgroundColor: colors.white}}
      contentContainerStyle={{flex: 1}}
      showsVerticalScrollIndicator={false}
      enableOnAndroid
      {...props}>
      {props.children}
    </KeyboardAwareScrollView>
  );
};

KeyboardAvoidWrapper.defaultProps = {
  keyboardVerticalOffsetAndroid: 65,
};

KeyboardAvoidWrapper.propTypes = {
  keyboardVerticalOffsetAndroid: PropTypes.number,
  children: PropTypes.any,
};

export default KeyboardAvoidWrapper;
