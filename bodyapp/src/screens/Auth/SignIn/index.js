import React, {useState} from 'react';
import {View, TouchableOpacity, Image, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import {routeNames} from '_enums';
import {colors} from '_colors';
import {Button, TextInput, Text, KeyboardAvoidWrapper} from '_components';
import {images} from '_images';
import {EMAIL_RE} from '_services/validator';
import {authActions} from '_store/auth';
import {replaceText} from '_helpers';

import styles from './styles';
import {SafeAreaView} from 'react-native-safe-area-context';

const SignIn = props => {
  const [emailOrLogin, setEmailOrLogin] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const {loading, error} = useSelector(state => state.auth);

  const signIn = () => {
    let data;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (reg.test(emailOrLogin)) {
      data = {email: emailOrLogin, password};
    } else {
      data = {password, username: emailOrLogin};
    }

    dispatch(authActions.login(data));
  };

  return (
    <ScrollView
      bounces={false}
      style={{
        backgroundColor: 'white',
      }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <SafeAreaView>
          <Text style={{fontSize: 20}}>Log in</Text>
        </SafeAreaView>
        <TextInput
          placeholder="Enter email or login"
          onChangeText={setEmailOrLogin}
        />
        <TextInput
          placeholder="Password"
          onChangeText={setPassword}
          isPassword
        />
        <Button text="Log in" onPress={signIn} loading={loading} />
        <View style={{height: 50}}>
          {error && (
            <Text style={{color: 'red', textAlign: 'center', marginTop: 20}}>
              {error}
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={{marginTop: 16}}
          onPress={() => props.navigation.navigate(routeNames.signUp)}>
          <Text style={{fontSize: 15, color: colors.grey}}>
            Don`t have an account?{' '}
            <Text style={{fontWeight: '600', color: colors.black}}>
              Sign Up
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

SignIn.propTypes = {
  navigation: PropTypes.object.isRequired,
};

SignIn.defaultProps = {
  navigation: null,
};

export default SignIn;
