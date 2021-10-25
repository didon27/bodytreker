import React, {useState} from 'react';
import {Keyboard, ScrollView, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {Text, TextInput, Button, KeyboardAvoidWrapper} from '_components';
import {routeNames} from '_enums';
import {fieldValidator} from '_services/validator';
import {userActions} from '_store/user';
import {colors} from '_colors';
import {replaceText} from '_helpers';

import styles from './styles';
import {SafeAreaView} from 'react-native-safe-area-context';

const SignUp = props => {
  const {createUserLoading, createUserError} = useSelector(state => state.user);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [confrimPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();

  const signUp = () => {
    console.log('fsdfsf32232');

    dispatch(
      userActions.create(
        {email},
        {route: routeNames.confirmEmail, params: {email}},
      ),
    );
  };

  return (
    <View style={{backgroundColor: colors.white}}>
      <SafeAreaView></SafeAreaView>
      <View style={{paddingHorizontal: 20}}>
        <TextInput placeholder="Email" onChangeText={setEmail} />
        {/* <TextInput placeholder="Username" onChangeText={setUsername} />
        <TextInput
          placeholder="Password"
          onChangeText={setPassword}
          isPassword
        />
        <TextInput
          placeholder="Confrim password"
          onChangeText={setConfirmPassword}
          isPassword
        /> */}
        <Button text="Sign Up" onPress={signUp} />
      </View>
    </View>
  );
};

export default SignUp;
