import React, { useContext, useEffect, useState } from 'react';
import {
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Text, View, TextInput } from 'components';
import { images } from 'images';
import { authActions } from 'store/auth';
import Header from '../components/Header';
import { colors } from 'colors';
import { LocalizationContext } from 'services';
import { routeNames } from 'enums';

import styles from './styles';
import { storage } from 'services/storage';

const SignIn = ({ navigation }) => {
  const { translations } = useContext(LocalizationContext);
  const [emailOrLogin, setEmailOrLogin] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const { loading, errorLogin } = useSelector(state => state.auth);

  useEffect(() => {
    if (errorLogin) {
      dispatch(authActions.setErrorLogin(null));
    }
  }, [password, emailOrLogin]);

  const signIn = async () => {
    if (emailOrLogin.length < 6) {
      dispatch(
        authActions.setErrorLogin({ email: translations.minimum_six_characters }),
      );
      return;
    }

    if (password.length < 6) {
      dispatch(
        authActions.setErrorLogin({
          password: translations.minimum_six_characters,
        }),
      );
      return;
    }

    let data = {};
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (reg.test(emailOrLogin)) {
      data = { email: emailOrLogin.toLowerCase().trim(), password };
    } else {
      data = { password, username: emailOrLogin };
    }
    data.fcm_token = await storage.get('fcmToken');


    dispatch(authActions.login(data));
  };

  return (
    <KeyboardAvoidingView behavior="padding">
      <StatusBar barStyle="light-content" />
      <Header navigation={navigation} />
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
            {translations.singIn}
          </Text>
          <TextInput
            placeholderTextColor={'#adadad'}
            placeholder={`Email | ${translations.login}`}
            error={errorLogin?.email}
            onChangeText={setEmailOrLogin}
          />
          <TextInput
            placeholderTextColor={'#adadad'}
            placeholder={translations.password}
            error={errorLogin?.password}
            onChangeText={setPassword}
            isPassword
          />
          <Button
            text={translations.singIn}
            onPress={signIn}
            loading={loading}
            style={{ marginTop: 24 }}
          />
          <TouchableOpacity
            style={{ marginTop: 16 }}
            onPress={() => navigation.navigate(routeNames.forgotPassword)}>
            <Text size={14} color={colors.white} right>
              {translations.forgotPassword}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
