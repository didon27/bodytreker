import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import {routeNames} from 'enums';
import {colors} from 'colors';
import {Button, Text, KeyboardAvoidWrapper} from 'components';
import {images} from 'images';
import {EMAIL_RE} from 'services/validator';
import {authActions} from 'store/auth';
import {replaceText} from 'helpers';

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
        source={require('../../../images/start-background.jpeg')}
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
          <TouchableOpacity
            onPress={signIn}
            style={{
              backgroundColor: '#6db2db',
              marginTop: 26,
              height: 56,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text size={20} color={'white'} style={{fontWeight: '600'}}>
              Войти
            </Text>
          </TouchableOpacity>
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
    // <ScrollView
    //   bounces={false}
    //   style={{
    //     backgroundColor: 'white',
    //   }}>
    //   <View
    //     style={{
    //       flex: 1,
    //       paddingHorizontal: 20,
    //       alignItems: 'center',
    //       justifyContent: 'center',
    //     }}>
    //     <SafeAreaView>
    //       <Text style={{fontSize: 20}}>Log in</Text>
    //     </SafeAreaView>
    //     <TextInput
    //       placeholder="Enter email or login"
    //       onChangeText={setEmailOrLogin}
    //     />
    //     <TextInput
    //       placeholder="Password"
    //       onChangeText={setPassword}
    //       isPassword
    //     />
    //     <Button text="Log in" onPress={signIn} loading={loading} />
    //     <View style={{height: 50}}>
    //       {error && (
    //         <Text style={{color: 'red', textAlign: 'center', marginTop: 20}}>
    //           {error}
    //         </Text>
    //       )}
    //     </View>
    //     <TouchableOpacity
    //       style={{marginTop: 16}}
    //       onPress={() => props.navigation.navigate(routeNames.signUp)}>
    //       <Text style={{fontSize: 15, color: colors.grey}}>
    //         Don`t have an account?{' '}
    //         <Text style={{fontWeight: '600', color: colors.black}}>
    //           Sign Up
    //         </Text>
    //       </Text>
    //     </TouchableOpacity>
    //   </View>
    // </ScrollView>
  );
};

SignIn.propTypes = {
  navigation: PropTypes.object.isRequired,
};

SignIn.defaultProps = {
  navigation: null,
};

export default SignIn;
