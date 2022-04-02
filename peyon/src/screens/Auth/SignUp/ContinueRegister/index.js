import React, { useContext, useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, StatusBar, ImageBackground, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { LocalizationContext } from 'services';
import { Button, Text, View, TextInput, CustomSafeAreaView } from 'components';
import { images } from 'images';
import { authActions } from 'store/auth';
import Header from '../../components/Header';
import { colors } from 'colors';

import styles from './styles';
import { storage } from 'services/storage';
import { routeNames } from 'enums';
import { mamaAxios } from 'services/api';
import { API_URL } from 'constants';

const ContinueRegister = props => {
  const { translations } = useContext(LocalizationContext);
  const { email } = props.route.params;
  const [username, setUresname] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { loading, errorContinueRegister } = useSelector(state => state.auth);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    if (errorContinueRegister) {
      dispatch(authActions.setErrorContinueRegister(null));
    }
  }, [password, confirmPassword, username]);

  const signUp = async () => {
    let _errors = {};

    if (!first_name.length) {
      _errors.first_name = translations.fieldIsRequired;
    }

    if (!last_name.length) {
      _errors.last_name = translations.fieldIsRequired;
    }

    await mamaAxios.post(`${API_URL}/user/check-username`,
      { id: null, username: username },
    ).catch(error => {
      _errors.username = error.response.data.message;
    })

    if (username.length < 6) {
      _errors.username = translations.minimum_six_characters;
    }

    if (password.length < 6) {
      _errors.password = translations.minimum_six_characters;
    }

    if (confirmPassword.length < 6) {
      _errors.confirmPassword = translations.minimum_six_characters;
    }
    if (confirmPassword !== password) {
      _errors.confirmPassword = translations.password_mismatch;
      _errors.password = translations.password_mismatch;
    }


    if (Object.keys(_errors).length) {
      setErrors(_errors);
      return;
    }

    let fcm_token = await storage.get('fcmToken');

    props.navigation.navigate(routeNames.socialNetwork, {
      email,
      username,
      password,
      first_name,
      last_name,
      fcm_token
    })
  };

  return (

    <KeyboardAvoidingView 

 behavior="padding">

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
        <ScrollView showsVerticalScrollIndicator={false}>
          <CustomSafeAreaView />
          <View style={styles.centerBlock}>
            <Text color={colors.white} size={28}>
              {translations.signUp}
            </Text>
            <Text color={colors.lightGrey} size={16} mTop={10} mBottom={10}>
              {translations.fields_to_complete_registration}
            </Text>
            {/* <TextInput
            value={email}
            placeholderTextColor={'#adadad'}
            placeholder="Email"
            disabled
          /> */}
            <TextInput
              value={first_name}
              error={errors?.first_name}
              placeholderTextColor={'#adadad'}
              placeholder={translations.first_name}
              onChangeText={setFirstName}
            />
            <TextInput
              value={last_name}
              error={errors?.last_name}
              placeholderTextColor={'#adadad'}
              placeholder={translations.last_name}
              onChangeText={setLastName}
            />
            <TextInput
              value={username}
              placeholderTextColor={'#adadad'}
              placeholder={translations.login}
              error={errors?.username}
              onChangeText={setUresname}
            />
            <TextInput
              value={password}
              placeholderTextColor={'#adadad'}
              placeholder={translations.password}
              isPassword
              error={errors?.password}
              onChangeText={setPassword}
            />
            <TextInput
              value={confirmPassword}
              placeholderTextColor={'#adadad'}
              placeholder={translations.repeat_password}
              isPassword
              error={errors?.confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <Button
              text={translations.continue}
              onPress={signUp}
              loading={loading}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>

  );
};

export default ContinueRegister;
