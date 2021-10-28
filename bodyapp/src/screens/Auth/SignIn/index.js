import React, {useState} from 'react';
import {View, TouchableOpacity, Image, TextInput} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import {Button, Text} from 'components';
import {images} from 'images';
import {authActions} from 'store/auth';

import styles from './styles';

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
    <View flex>
      <Image
        resizeMode="cover"
        blurRadius={20}
        style={{width: '100%', height: '100%', zIndex: 0}}
        source={images.startBackground}
      />
      <View style={styles.dimmer} />
      <View
        style={{
          position: 'absolute',
          zIndex: 9999,
          width: '100%',
          height: '100%',
          paddingHorizontal: 20,
          justifyContent: 'center',
        }}>
        <Text style={{color: 'white', fontSize: 32, fontWeight: '600'}}>
          Вход
        </Text>
        <View
          style={{
            padding: 20,
            backgroundColor: '#202124cc',
            borderRadius: 20,
            marginTop: 20,
          }}>
          <TextInput
            style={{
              backgroundColor: 'white',
              height: 48,
              borderRadius: 10,
              paddingHorizontal: 20,
              fontSize: 16,
            }}
            placeholderTextColor={'#adadad'}
            placeholder="Email"
            onChangeText={setEmailOrLogin}
          />
          <TextInput
            style={{
              backgroundColor: 'white',
              height: 48,
              fontSize: 16,
              borderRadius: 10,
              paddingHorizontal: 20,
              marginTop: 16,
            }}
            placeholderTextColor={'#adadad'}
            placeholder="Пароль"
            onChangeText={setPassword}
            isPassword
          />
          {error && (
            <Text style={{color: 'red', textAlign: 'center', marginTop: 20}}>
              {error}
            </Text>
          )}
          <Button text={'Войти'} onPress={signIn} loading={loading} />
          <TouchableOpacity
            style={{marginTop: 20}}
            onPress={() => console.log('fsdfs')}>
            <Text size={14} color={'white'} style={{textAlign: 'right'}}>
              Забыли пароль?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

SignIn.propTypes = {
  navigation: PropTypes.object.isRequired,
};

SignIn.defaultProps = {
  navigation: null,
};

export default SignIn;
