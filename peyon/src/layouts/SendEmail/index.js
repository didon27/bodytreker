import React, {useEffect} from 'react';
import {Image, KeyboardAvoidingView, StatusBar} from 'react-native';

import {Button, Text, View, TextInput, Header} from 'components';
import {images} from 'images';
import {colors} from 'colors';

import styles from './styles';

const SignUp = ({
  email,
  setEmail,
  error,
  setError,
  title,
  loading,
  sendServer,
  navigation,
  subtitle,
  buttonText,
}) => {
  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [email]);

  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const signUp = () => {
    if (email.length < 6) {
      setError('Min length 6');
      return;
    }
    sendServer();
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
            {title}
          </Text>
          <Text color={colors.lightGrey} size={16} mTop={10} mBottom={10}>
            {subtitle}
          </Text>
          <TextInput
            placeholderTextColor={'#adadad'}
            placeholder="Email"
            error={error}
            onChangeText={setEmail}
          />
          <Button
            text={buttonText}
            onPress={signUp}
            loading={loading}
            disabled={!reg.test(email)}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
