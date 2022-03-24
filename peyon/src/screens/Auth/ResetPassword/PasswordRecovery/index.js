import React, {useContext, useEffect, useState} from 'react';
import {Image, KeyboardAvoidingView, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {Button, Text, View, TextInput} from 'components';
import {images} from 'images';
import {authActions} from 'store/auth';
import Header from '../../components/Header';
import {colors} from 'colors';
import {LocalizationContext} from 'services';

import styles from './styles';

const PasswordRecovery = props => {
  const {translations} = useContext(LocalizationContext);
  const {email} = props.route.params;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {loading, resetPasswordError, reset_token} = useSelector(
    state => state.auth,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (resetPasswordError) {
      dispatch(authActions.setErrorContinueRegister(null));
    }
  }, [password, confirmPassword]);

  const signUp = () => {
    if (password.length < 6) {
      dispatch(
        authActions.setErrorPasswordReset({
          password: translations.minimum_six_characters,
        }),
      );
      return;
    }

    if (confirmPassword.length < 6) {
      dispatch(
        authActions.setErrorPasswordReset({
          confirmPassword: translations.minimum_six_characters,
        }),
      );
      return;
    }

    if (confirmPassword !== password) {
      dispatch(
        authActions.setErrorPasswordReset({
          confirmPassword: translations.password_mismatch,
          password: translations.password_mismatch,
        }),
      );
      return;
    }

    dispatch(
      authActions.resetPasswordRequest({
        email,
        password,
        reset_token,
      }),
    );
  };

  return (
    <KeyboardAvoidingView behavior="padding">
      <StatusBar barStyle="light-content" />
      <Header navigation={props.navigation} />
      <Image
        resizeMode="cover"
        blurRadius={20}
        style={styles.background}
        source={images.startBackground}
      />
      <View style={styles.dimmer} />
      <View style={styles.centerContainer}>
        <View style={styles.centerBlock}>
          <Text color={colors.white} size={28}>
            {translations.signUp}
          </Text>
          <Text color={colors.lightGrey} size={16} mTop={10} mBottom={10}>
            {translations.fields_to_complete_registration}
          </Text>
          <TextInput
            value={email}
            placeholderTextColor={'#adadad'}
            placeholder="Email"
            disabled
          />
          <TextInput
            value={password}
            placeholderTextColor={'#adadad'}
            placeholder={translations.password}
            isPassword
            error={resetPasswordError?.password}
            onChangeText={setPassword}
          />
          <TextInput
            value={confirmPassword}
            placeholderTextColor={'#adadad'}
            placeholder={translations.repeat_password}
            isPassword
            error={resetPasswordError?.confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Button
            text={translations.continue}
            onPress={signUp}
            loading={loading}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default PasswordRecovery;
