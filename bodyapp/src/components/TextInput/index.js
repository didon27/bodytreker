import React, {useState} from 'react';
import {TextInput, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import {Text} from 'components';
import {colors} from 'colors';

import {styles} from './styles';

const CustomTextInput = (props) => {
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <View style={[styles.container, props.containerStyle]}>
      <View style={styles.textBoxBtnHolder}>
        <TextInput
          placeholder={props.placeholder}
          placeholderTextColor={props.placeholderTextColor}
          underlineColorAndroid="transparent"
          secureTextEntry={props.isPassword && hidePassword}
          value={props.value}
          style={[styles.textBox, props.error && {borderBottomColor: colors.pink}, props.textInputStyle]}
          onChangeText={text => props.onChangeText(text)}
          {...props}
        />
        { props.isPassword &&
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.visibilityBtn}
            onPress={() => setHidePassword(!hidePassword)}>
            <Icon
              name={hidePassword ? 'visibility' : 'visibility-off'}
              style={styles.btnImage}
              color={props.isPasswordIconRed ? colors.errorColor : colors.turquoise}
              size={23}
            />
          </TouchableOpacity>
        }
      </View>
      { props.error &&
        <View style={styles.errorContainer}>
          <Text style={styles.errorMsg}>{props.error}</Text>
        </View>
      }
    </View>
  );
};

CustomTextInput.propTypes = {
  containerStyle: PropTypes.object,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  error: PropTypes.string,
  isPassword: PropTypes.bool,
  isPasswordIconRed: PropTypes.string,
  textInputStyle: PropTypes.object
};

CustomTextInput.defaultProps = {
  containerStyle: {},
  placeholder: null,
  placeholderTextColor: colors.grey,
  value: null,
  onChangeText: null,
  error: null,
  isPassword: false,
  isPasswordIconRed: null,
  textInputStyle: {}
};

export default CustomTextInput;
