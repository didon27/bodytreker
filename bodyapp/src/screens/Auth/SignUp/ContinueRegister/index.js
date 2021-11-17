import React, {useContext, useEffect, useState} from 'react';
import {Image, KeyboardAvoidingView, StatusBar} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {LocalizationContext} from 'services';
import {Button, Text, View, TextInput} from 'components';
import {images} from 'images';
import {authActions} from 'store/auth';
import Header from '../../components/Header';
import {colors} from 'colors';

import styles from './styles';

const ContinueRegister = props => {
  const {translations} = useContext(LocalizationContext);
  const {email} = props.route.params;
  const [username, setUresname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {loading, errorContinueRegister} = useSelector(state => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (errorContinueRegister) {
      dispatch(authActions.setErrorContinueRegister(null));
    }
  }, [password, confirmPassword, username]);

  const signUp = () => {
    if (username.length < 6) {
      dispatch(
        authActions.setErrorContinueRegister({username: 'Min length 6'}),
      );
      return;
    }

    if (password.length < 6) {
      dispatch(
        authActions.setErrorContinueRegister({password: 'Min length 6'}),
      );
      return;
    }

    if (confirmPassword.length < 6) {
      dispatch(
        authActions.setErrorContinueRegister({confirmPassword: 'Min length 6'}),
      );
      return;
    }

    if (confirmPassword !== password) {
      dispatch(
        authActions.setErrorContinueRegister({
          confirmPassword: translations.password_mismatch,
          password: translations.password_mismatch,
        }),
      );
      return;
    }

    dispatch(
      authActions.continueRegisterRequest({
        email,
        username,
        password,
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
            value={username}
            placeholderTextColor={'#adadad'}
            placeholder={translations.login}
            error={errorContinueRegister?.username}
            onChangeText={setUresname}
          />
          <TextInput
            value={password}
            placeholderTextColor={'#adadad'}
            placeholder={translations.password}
            isPassword
            error={errorContinueRegister?.password}
            onChangeText={setPassword}
          />
          <TextInput
            value={confirmPassword}
            placeholderTextColor={'#adadad'}
            placeholder={translations.repeat_password}
            isPassword
            error={errorContinueRegister?.confirmPassword}
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

export default ContinueRegister;
