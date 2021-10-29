import React, {useState} from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import {Button, Text, View, TextInput} from 'components';
import {images} from 'images';
import {authActions} from 'store/auth';

import styles from './styles';
import {colors} from 'colors';

const SignIn = props => {
  const [emailOrLogin, setEmailOrLogin] = useState('');
  const [password, setPassword] = useState('');
  const [saveMe, setSaveMe] = useState(false);

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
        style={styles.background}
        source={images.startBackground}
      />
      <View style={styles.dimmer} />
      <View style={styles.centerContainer}>
        <Text color={colors.white} size={32}>
          Вход
        </Text>
        <View style={styles.centerBlock}>
          <TextInput
            placeholderTextColor={'#adadad'}
            placeholder="Email"
            onChangeText={setEmailOrLogin}
          />
          <TextInput
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
          <View row centered mTop={16} mBottom={10}>
            <TouchableOpacity
              onPress={() => setSaveMe(!saveMe)}
              style={styles.saveMeContainer}>
              {saveMe && <View style={styles.saveMeBlock} />}
            </TouchableOpacity>
            <Text color={'white'} mLeft={10}>
              Запомнить меня
            </Text>
          </View>
          <Button text={'Войти'} onPress={signIn} loading={loading} />
          <TouchableOpacity
            style={{marginTop: 20}}
            onPress={() => console.log('fsdfs')}>
            <Text size={14} color={'white'} right>
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
