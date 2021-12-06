import React, {useState} from 'react';
import {TextInput, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import {Text} from 'components';
import {colors} from 'colors';

import {styles} from './styles';

const CustomTextInput = props => {
  const [hidePassword, setHidePassword] = useState(true);
  const {error, disabled, label, labelStyle} = props;
  return (
    <View
      style={[
        styles.container,
        disabled && {backgroundColor: colors.lightGrey},
        label && {height: 60},
        props.containerStyle,
        error && {borderColor: colors.pink, borderWidth: 2},
      ]}>
      {props.label && (
        <Text size={16} mLeft={8} style={labelStyle}>
          {label}
        </Text>
      )}
      <View style={styles.textBoxBtnHolder}>
        <TextInput
          editable={!disabled}
          placeholder={props.placeholder}
          placeholderTextColor={props.placeholderTextColor}
          underlineColorAndroid="transparent"
          secureTextEntry={props.isPassword && hidePassword}
          value={props.value}
          multiline={props.multiline}
          style={[
            styles.textBox,
            props.textInputStyle,
            !props.isPassword && {paddingRight: 0},
            disabled && {color: 'grey'},
          ]}
          onChangeText={text => props.onChangeText(text)}
          {...props}
        />
        {props.isPassword && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.visibilityBtn}
            onPress={() => setHidePassword(!hidePassword)}>
            <Icon
              name={!hidePassword ? 'visibility' : 'visibility-off'}
              style={styles.btnImage}
              color={props.isPasswordIconRed ? colors.errorColor : colors.grey}
              size={23}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && typeof error === 'string' && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorMsg}>{error}</Text>
        </View>
      )}
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
  textInputStyle: PropTypes.object,
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
  textInputStyle: {},
};

export default CustomTextInput;
