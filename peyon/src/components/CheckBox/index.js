import React from 'react';
import {TouchableOpacity, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';

import Text from '../Text';
import View from '../View';
import {colors} from 'colors';

const CheckBox = ({selected, changeSelect}) => {
  return (
    <TouchableOpacity
      onPress={() => changeSelect(!selected)}
      style={{
        borderWidth: 1,
        borderColor: colors.lightGrey,
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {selected && (
        <View
          style={{
            backgroundColor: '#4285f4',
            width: 10,
            height: 10,
            borderRadius: 5,
          }}
        />
      )}
    </TouchableOpacity>
  );
};

export default CheckBox;
